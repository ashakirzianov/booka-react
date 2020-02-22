import React from 'react';
import {
    BookFragment, BookPath,
    BookRange,
    Highlight,
    HighlightPost,
} from 'booka-common';

import {
    Themed, colors, getFontSize, Row,
    point, Callback, getHighlights, BorderLink, Theme,
} from '../atoms';
import { BookFragmentComp, BookSelection } from '../reader';
import { generateQuoteLink } from './common';
import { useCopy, linkToString, BookLink } from '../core';
import { ColorizedRange } from '../reader/BookFragmentComp.blocks';
import { BookContextMenu, ContextMenuTarget } from './BookContextMenu';

export type BookViewCompProps = Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: Callback<BookPath>,
    quoteRange: BookRange | undefined,
    highlights: Highlight[],
    addHighlight: Callback<HighlightPost>,
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

    const menuTarget: ContextMenuTarget = selection.current
        ? { target: 'selection', selection: selection.current }
        : { target: 'empty' };

    return <BookContextMenu
        target={menuTarget}
        onAddHighlight={group => selection.current && addHighlight({
            group,
            location: {
                bookId, range: selection.current?.range,
            },
        })}
    >
        {
            fragment.previous === undefined ? null :
                <PathLink
                    theme={theme}
                    text={fragment.previous.title || 'Previous'}
                    link={{
                        link: 'book',
                        bookId,
                        path: fragment.previous.path,
                    }}
                />
        }
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
        {
            fragment.next === undefined ? null :
                <PathLink
                    theme={theme}
                    text={fragment.next.title || 'Next'}
                    link={{
                        link: 'book',
                        bookId,
                        path: fragment.next.path,
                    }}
                />
        }
    </BookContextMenu>;
}

type PathLinkProps = Themed & {
    link: BookLink,
    text: string,
};
function PathLink({ theme, text, link }: PathLinkProps) {
    return <Row centered margin={point(1)}>
        <BorderLink
            theme={theme}
            text={text}
            to={linkToString(link)}
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
        range: h.location.range,
    }));
}

function colorForGroup(group: string) {
    // TODO: implement
    return 'green';
}
