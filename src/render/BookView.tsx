import React, { useCallback, memo, useMemo, useState, useRef } from 'react';
import { throttle } from 'lodash';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor, doesRangeOverlap, rangeToString,
} from 'booka-common';

import {
    BookFragmentComp, BookSelection, ColorizedRange,
} from '../reader';
import {
    useOnCopy, useHighlights, useTheme, useUrlActions, useUrlQuery, usePositions, useOnClick,
} from '../application';
import { Themed, colors, Theme } from '../core';
import { config } from '../config';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';
import { View, BorderButton, regularSpace, colorForHighlightGroup } from '../controls';
import { BookPathLink } from './Navigation';

export const BookView = memo(function BookViewF({
    bookId, fragment,
}: {
    bookId: string,
    fragment: BookFragment,
}) {
    const { theme } = useTheme();
    const { pathToScroll, onScroll, onNavigation } = useScrollHandlers(bookId);
    const { onSelectionChange, menuTarget } = useSelectionHandlers(bookId);
    const { colorization } = useColorization(bookId);

    return <>
        <AnchorButton
            theme={theme}
            defaultTitle='Previous'
            anchor={fragment.previous}
            bookId={bookId}
            callback={onNavigation}
        />
        <BookFragmentComp
            fragment={fragment}
            color={colors(theme).text}
            refColor={colors(theme).accent}
            refHoverColor={colors(theme).highlight}
            fontSize={theme.fontSizes.text * theme.fontScale}
            fontFamily={theme.fontFamilies.book}
            colorization={colorization}
            pathToScroll={pathToScroll}
            onScroll={onScroll}
            onSelectionChange={onSelectionChange}
        />
        <AnchorButton
            theme={theme}
            defaultTitle='Next'
            anchor={fragment.next}
            bookId={bookId}
            callback={onNavigation}
        />
        <BookContextMenu
            bookId={bookId}
            target={menuTarget}
        />
    </>;
});

function useColorization(bookId: string) {
    const { theme } = useTheme();
    const { quote } = useUrlQuery();
    const highlights = useHighlights(bookId);

    const colorization = useMemo(
        () => quoteColorization(quote, theme)
            .concat(highlightsColorization(highlights, theme))
        ,
        [quote, highlights, theme],
    );
    return { colorization };
}

function useSelectionHandlers(bookId: string) {
    const { updateQuoteRange } = useUrlActions();

    const highlights = useHighlights(bookId);
    const selection = useRef<BookSelection | undefined>(undefined);
    const [menuTarget, setMenuTarget] = useState<ContextMenuTarget>({ target: 'empty' });
    const onSelectionChange = useCallback((sel: BookSelection | undefined) => {
        selection.current = sel?.text?.length ? sel : undefined;
    }, []);
    useOnCopy(useCallback(e => {
        e.preventDefault();
        if (selection.current && e.clipboardData) {
            const selectionText = `${selection.current.text}\n${generateQuoteLink(bookId, selection.current.range)}`;
            e.clipboardData.setData('text/plain', selectionText);
        }
        updateQuoteRange(selection.current && selection.current.range);
    }, [bookId, updateQuoteRange, selection]));
    useOnClick(useCallback(e => {
        const sel = selection.current;
        if (sel !== undefined) {
            const position = {
                top: e.clientY,
                left: e.clientX,
            };
            const selectedHighlight = highlights
                .find(h => doesRangeOverlap(h.range, sel.range));
            const target: ContextMenuTarget = selectedHighlight
                ? { target: 'highlight', highlight: selectedHighlight, position }
                : { target: 'selection', selection: sel, position };
            setMenuTarget(target);
        } else {
            setMenuTarget({ target: 'empty' });
        }
    }, [highlights]));

    return { onSelectionChange, menuTarget };
}

function useScrollHandlers(bookId: string) {
    const { path } = useUrlQuery();
    const { updateBookPath } = useUrlActions();
    const { addCurrentPosition } = usePositions();
    const [needToScroll, setNeedToScroll] = useState(true);
    const onScroll = useCallback(throttle((p: BookPath | undefined) => {
        if (needToScroll) {
            setNeedToScroll(false);
        }
        updateBookPath(p);
        if (p) {
            addCurrentPosition({ path: p, bookId });
        }
    }, 1000),
        [setNeedToScroll, updateBookPath, addCurrentPosition, needToScroll, bookId],
    );
    const onNavigation = useCallback(
        () => setNeedToScroll(true),
        [setNeedToScroll],
    );

    return {
        onScroll, onNavigation,
        pathToScroll: needToScroll ? path : undefined,
    };
}

function AnchorButton({
    theme, defaultTitle, anchor, bookId, callback,
}: Themed & {
    bookId: string,
    anchor: BookAnchor | undefined,
    defaultTitle: string,
    callback?: () => void,
}) {
    if (!anchor) {
        return null;
    } else {
        return <View style={{
            flexDirection: 'row',
            margin: regularSpace,
            justifyContent: 'center',
        }}>
            <BookPathLink bookId={bookId} path={anchor.path}>
                <BorderButton
                    theme={theme}
                    text={anchor.title || defaultTitle}
                    callback={callback}
                />
            </BookPathLink>
        </View>;
    }
}

function quoteColorization(quote: BookRange | undefined, theme: Theme): ColorizedRange[] {
    return quote
        ? [{
            color: colors(theme).pink,
            range: quote,
        }]
        : [];
}

function highlightsColorization(highlights: Highlight[], theme: Theme): ColorizedRange[] {
    return highlights.map(h => ({
        color: colors(theme)[colorForHighlightGroup(h.group)],
        range: h.range,
    }));
}

function generateQuoteLink(id: string, quote: BookRange) {
    return `${config().frontUrl}/book/${id}?q=${rangeToString(quote)}`;
}
