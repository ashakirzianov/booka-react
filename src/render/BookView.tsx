import React, { useCallback, memo, useMemo, useState, useRef, ReactNode } from 'react';
import { throttle } from 'lodash';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor,
} from 'booka-common';

import {
    BookFragmentComp, BookSelection, ColorizedRange,
} from '../reader';
import {
    useHighlights, useTheme, useUrlActions, useUrlQuery, usePositions,
} from '../application';
import { Themed, colors, Theme } from '../core';
import { BookContextMenu } from './BookContextMenu';
import {
    View, BorderButton, regularSpace, colorForHighlightGroup,
} from '../controls';
import { BookPathLink, BookRefLink } from './Navigation';

export const BookView = memo(function BookViewF({
    bookId, fragment,
}: {
    bookId: string,
    fragment: BookFragment,
}) {
    const { theme } = useTheme();
    const { pathToScroll, onScroll, onNavigation } = useScrollHandlers(bookId);
    const { onSelectionChange, selection } = useSelectionHandlers(bookId);
    const { colorization } = useColorization(bookId);
    const RefComp = useCallback(({ refId, children }: { refId: string, children: ReactNode }) => {
        return <BookRefLink bookId={bookId} refId={refId}>
            {children}
        </BookRefLink>;
    }, [bookId]);

    return <BookContextMenu
        bookId={bookId}
        selection={selection}
    >
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
            RefComp={RefComp}
        />
        <AnchorButton
            theme={theme}
            defaultTitle='Next'
            anchor={fragment.next}
            bookId={bookId}
            callback={onNavigation}
        />
    </BookContextMenu>;
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
    const selection = useRef<BookSelection | undefined>(undefined);
    const onSelectionChange = useCallback((sel: BookSelection | undefined) => {
        selection.current = sel?.text?.length ? sel : undefined;
    }, []);

    return { onSelectionChange, selection };
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
