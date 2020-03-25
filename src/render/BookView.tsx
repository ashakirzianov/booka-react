import React, { useRef, useCallback } from 'react';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor, doesRangeOverlap, rangeToString,
} from 'booka-common';

import {
    BookFragmentComp, BookSelection, ColorizedRange,
} from '../reader';
import { useCopy } from '../application';
import { Themed, colors, getFontSize, Theme } from '../core';
import { config } from '../config';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';
import { View, BorderButton, normalMargin, colorForHighlightGroup } from '../controls';
import { BookPathLink } from './Navigation';

export function BookView({
    bookId, fragment, theme, pathToScroll, updateBookPosition,
    highlights, quoteRange, setQuoteRange, openRef, onNavigation,
}: Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: (path: BookPath) => void,
    quoteRange: BookRange | undefined,
    highlights: Highlight[],
    setQuoteRange: (range: BookRange | undefined) => void,
    openRef: (refId: string) => void,
    onNavigation?: () => void,
}) {
    const selection = useRef<BookSelection | undefined>(undefined);
    const selectionHandler = useCallback((sel: BookSelection | undefined) => {
        selection.current = sel;
    }, []);
    useCopy(useCallback((e: ClipboardEvent) => {
        if (selection.current && e.clipboardData) {
            e.preventDefault();
            const selectionText = `${selection.current.text}\n${generateQuoteLink(bookId, selection.current.range)}`;
            e.clipboardData.setData('text/plain', selectionText);
        }
        setQuoteRange(selection.current && selection.current.range);
    }, [bookId, setQuoteRange]));

    const colorization = quoteColorization(quoteRange, theme)
        .concat(highlightsColorization(highlights, theme))
        ;

    const currentSelection = selection.current;
    const selectedHighlight = currentSelection !== undefined
        ? highlights.find(h => doesRangeOverlap(h.range, currentSelection.range))
        : undefined;

    const menuTarget: ContextMenuTarget = selection.current
        ? (
            selectedHighlight
                ? { target: 'highlight', highlight: selectedHighlight }
                : { target: 'selection', selection: selection.current }
        )
        : { target: 'empty' };

    return <BookContextMenu
        bookId={bookId}
        target={menuTarget}
    >
        <AnchorButton
            theme={theme}
            defaultTitle='Previous'
            anchor={fragment.previous}
            bookId={bookId}
            onClick={onNavigation}
        />
        <BookFragmentComp
            fragment={fragment}
            color={colors(theme).text}
            refColor={colors(theme).accent}
            refHoverColor={colors(theme).highlight}
            fontSize={getFontSize(theme, 'text')}
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
            onClick={onNavigation}
        />
    </BookContextMenu>;
}

function AnchorButton({
    theme, defaultTitle, anchor, bookId, onClick,
}: Themed & {
    bookId: string,
    anchor: BookAnchor | undefined,
    defaultTitle: string,
    onClick?: () => void,
}) {
    if (!anchor) {
        return null;
    } else {
        return <View style={{
            flexDirection: 'row',
            margin: normalMargin,
            justifyContent: 'center',
        }}>
            <BookPathLink bookId={bookId} path={anchor.path}>
                <BorderButton
                    theme={theme}
                    text={anchor.title || defaultTitle}
                    onClick={onClick}
                />
            </BookPathLink>
        </View>;
    }
}

function quoteColorization(quote: BookRange | undefined, theme: Theme): ColorizedRange[] {
    return quote
        ? [{
            color: colors(theme).yellow,
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
