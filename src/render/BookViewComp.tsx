import React, { useRef, useCallback } from 'react';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor, doesRangeOverlap, rangeToString,
} from 'booka-common';

import {
    Themed, colors, getFontSize, Row,
    point, getHighlights, BorderLink, Theme,
} from '../atoms';
import { BookFragmentComp, BookSelection, ColorizedRange } from '../reader';
import { useCopy } from '../application';
import { config } from '../config';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';

export function BookViewComp({
    bookId, fragment, theme, pathToScroll, updateBookPosition,
    highlights, quoteRange, setQuoteRange, openRef,
}: Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: (path: BookPath) => void,
    quoteRange: BookRange | undefined,
    highlights: Highlight[],
    setQuoteRange: (range: BookRange | undefined) => void,
    openRef: (refId: string) => void,
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
        <AnchorLink
            theme={theme}
            text='Previous'
            anchor={fragment.previous}
            bookId={bookId}
        />
        <BookFragmentComp
            fragment={fragment}
            color={colors(theme).text}
            refColor={colors(theme).accent}
            refHoverColor={colors(theme).highlight}
            fontSize={getFontSize(theme, 'text')}
            fontFamily={theme.fontFamilies.book}
            colorization={colorization}
            pathToScroll={pathToScroll || undefined}
            onScroll={updateBookPosition}
            onSelectionChange={selectionHandler}
            onRefClick={openRef}
        />
        <AnchorLink
            theme={theme}
            text='Next'
            anchor={fragment.next}
            bookId={bookId}
        />
    </BookContextMenu>;
}

function AnchorLink({ theme, text, anchor, bookId }: Themed & {
    bookId: string,
    anchor: BookAnchor | undefined,
    text: string,
}) {
    if (!anchor) {
        return null;
    }
    return <Row centered margin={point(1)}>
        <BorderLink
            theme={theme}
            text={anchor.title || text}
            to={`/book/${bookId}?p=${anchor.path}`}
            fontFamily='book'
        />
    </Row>;
}

function quoteColorization(quote: BookRange | undefined, theme: Theme): ColorizedRange[] {
    return quote
        ? [{
            color: getHighlights(theme).quote,
            range: quote,
        }]
        : [];
}

function highlightsColorization(highlights: Highlight[], theme: Theme): ColorizedRange[] {
    return highlights.map(h => ({
        color: colorForGroup(h.group),
        range: h.range,
    }));
}

function colorForGroup(group: string) {
    return group;
}

function generateQuoteLink(id: string, quote: BookRange) {
    return `${config().frontUrl}/book/${id}?q=${rangeToString(quote)}`;
}
