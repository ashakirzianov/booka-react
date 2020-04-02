import React, { useCallback, memo, useMemo, useState, useRef } from 'react';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor, doesRangeOverlap, rangeToString,
} from 'booka-common';

import {
    BookFragmentComp, BookSelection, ColorizedRange,
} from '../reader';
import { useOnCopy, useHighlights } from '../application';
import { Themed, colors, Theme } from '../core';
import { config } from '../config';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';
import { View, BorderButton, regularSpace, colorForHighlightGroup } from '../controls';
import { BookPathLink } from './Navigation';
import { trackComponent } from '../utils';
import { useQuote } from '../application/quoteHooks';

export const BookView = memo(function BookViewF({
    bookId, fragment, theme, pathToScroll, updateBookPosition,
    openRef, onNavigation,
}: Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: (path: BookPath) => void,
    openRef: (refId: string) => void,
    onNavigation?: () => void,
}) {
    const { quote, updateQuoteRange } = useQuote();
    const highlights = useHighlights(bookId);
    const selection = useRef<BookSelection | undefined>(undefined);
    const [menuTarget, setMenuTarget] = useState<ContextMenuTarget>({ target: 'empty' });
    const selectionHandler = useCallback((sel: BookSelection | undefined) => {
        selection.current = sel?.text?.length ? sel : undefined;
        const selectedHighlight = sel !== undefined
            ? highlights.find(h => doesRangeOverlap(h.range, sel.range))
            : undefined;
        const target: ContextMenuTarget = sel
            ? (
                selectedHighlight
                    ? { target: 'highlight', highlight: selectedHighlight }
                    : { target: 'selection', selection: sel }
            )
            : { target: 'empty' };
        setMenuTarget(target);
    }, [highlights]);
    useOnCopy(useCallback((e: ClipboardEvent) => {
        e.preventDefault();
        if (selection.current && e.clipboardData) {
            const selectionText = `${selection.current.text}\n${generateQuoteLink(bookId, selection.current.range)}`;
            e.clipboardData.setData('text/plain', selectionText);
        }
        updateQuoteRange(selection.current && selection.current.range);
    }, [bookId, updateQuoteRange, selection]));

    const colorization = useMemo(
        () => quoteColorization(quote, theme)
            .concat(highlightsColorization(highlights, theme))
        ,
        [quote, highlights, theme],
    );

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
            onScroll={updateBookPosition}
            onSelectionChange={selectionHandler}
            onRefClick={openRef}
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
trackComponent(BookView);

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
