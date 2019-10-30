import React from 'react';
import {
    BookFragment, BookPath, BookPositionLocator, pathLocator,
} from 'booka-common';

import {
    Themed, colors, fontSize, Row, BorderButton, point,
    EmptyLine, Callback,
} from '../atoms';
import { BookFragmentComp } from '../reader';
import { linkForLocation } from './common';

export type BookViewCompProps = Themed & {
    bookId: string,
    fragment: BookFragment,
    pathToScroll: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    // quoteRange: BookRange | undefined,
    // openFootnote: Callback<string>,
};
export function BookViewComp({
    bookId, fragment, theme,
    pathToScroll, updateBookPosition,
}: BookViewCompProps) {
    return <>
        <EmptyLine />
        {
            fragment.previous === undefined ? null :
                <PathLink
                    theme={theme}
                    text={fragment.previous.title || 'Previous'}
                    location={pathLocator(bookId, fragment.previous.path)}
                />
        }
        <BookFragmentComp
            fragment={fragment}
            color={colors(theme).text}
            refColor={colors(theme).accent}
            refHoverColor={colors(theme).highlight}
            fontSize={fontSize(theme, 'text')}
            fontFamily={theme.fontFamilies.book}
            pathToScroll={pathToScroll || undefined}
            onScroll={updateBookPosition}
        />
        {
            fragment.next === undefined ? null :
                <PathLink
                    theme={theme}
                    text={fragment.next.title || 'Next'}
                    location={pathLocator(bookId, fragment.next.path)}
                />
        }
        <EmptyLine />
    </>;
}

type PathLinkProps = Themed & {
    location: BookPositionLocator,
    text: string,
};
function PathLink({ theme, text, location }: PathLinkProps) {
    return <Row centered margin={point(1)}>
        <BorderButton
            theme={theme}
            text={text}
            fontFamily='book'
            to={linkForLocation(location)}
        />
    </Row>;
}
