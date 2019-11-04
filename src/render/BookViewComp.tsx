import React from 'react';
import {
    BookFragment, BookPath,
    BookRange,
} from 'booka-common';

import {
    Themed, colors, getFontSize, Row, BorderButton,
    point, Callback, highlights,
} from '../atoms';
import { BookFragmentComp, BookSelection } from '../reader';
import { generateQuoteLink } from './common';
import { useCopy, linkToString } from '../core';
import { BookLink } from '../ducks';

export type BookViewCompProps = Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | undefined,
    updateBookPosition: Callback<BookPath>,
    quoteRange: BookRange | undefined,
    setQuoteRange: Callback<BookRange | undefined>,
    openRef: Callback<string>,
};
export function BookViewComp({
    bookId, fragment, theme,
    pathToScroll, updateBookPosition,
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

    const colorization = quoteRange
        ? [{
            color: highlights(theme).quote,
            range: quoteRange,
        }]
        : [];

    return <>
        {
            fragment.previous === undefined ? null :
                <PathLink
                    theme={theme}
                    text={fragment.previous.title || 'Previous'}
                    link={{
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
                        bookId,
                        path: fragment.next.path,
                    }}
                />
        }
    </>;
}

type PathLinkProps = Themed & {
    link: BookLink,
    text: string,
};
function PathLink({ theme, text, link }: PathLinkProps) {
    return <Row centered margin={point(1)}>
        <BorderButton
            theme={theme}
            text={text}
            fontFamily='book'
            to={linkToString(link)}
        />
    </Row>;
}
