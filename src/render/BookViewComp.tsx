import React from 'react';
import {
    BookFragment, BookPath, BookRange,
    Highlight, BookAnchor, uuid, pathLessThan,
} from 'booka-common';

import {
    Themed, colors, getFontSize, Row,
    point, Callback, getHighlights, BorderLink, Theme,
} from '../atoms';
import { BookFragmentComp, BookSelection, ColorizedRange } from '../reader';
import { useCopy } from '../application';
import { linkToString } from '../core';
import { generateQuoteLink } from './common';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';

export type BookViewCompProps = Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: Callback<BookPath>,
    quoteRange: BookRange | undefined,
    highlights: Highlight[],
    addHighlight: Callback<Highlight>,
    setQuoteRange: Callback<BookRange | undefined>,
    openRef: Callback<string>,
};
export function BookViewComp({
    bookId, fragment, theme,
    pathToScroll, updateBookPosition,
    highlights, addHighlight,
    quoteRange, setQuoteRange,
    openRef,
}: BookViewCompProps) {
    const selection = React.useRef<BookSelection | undefined>(undefined);
    const selectionHandler = React.useCallback((sel: BookSelection | undefined) => {
        selection.current = sel;
    }, []);
    useCopy(React.useCallback((e: ClipboardEvent) => {
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
        target={menuTarget}
        onAddHighlight={group => selection.current && addHighlight({
            entity: 'highlight',
            _id: uuid(),
            local: true,
            group,
            bookId,
            range: selection.current?.range,
        })}
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

type PathLinkProps = Themed & {
    bookId: string,
    anchor: BookAnchor | undefined,
    text: string,
};
function AnchorLink({ theme, text, anchor, bookId }: PathLinkProps) {
    if (!anchor) {
        return null;
    }
    return <Row centered margin={point(1)}>
        <BorderLink
            theme={theme}
            text={anchor.title || text}
            to={linkToString({
                link: 'book',
                bookId,
                path: anchor.path,
            })}
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
    // TODO: implement
    return 'green';
}

// TODO: move to 'common'
function doesRangeOverlap(r1: BookRange, r2: BookRange): boolean {
    if (pathLessThan(r1.start, r2.start)) {
        return r1.end
            ? !pathLessThan(r1.end, r2.start)
            : true;
    } else {
        return r2.end
            ? !pathLessThan(r2.end, r1.start)
            : true;
    }
}
