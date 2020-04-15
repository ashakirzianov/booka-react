// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { CurrentPosition, LibraryCard } from 'booka-common';
import { Themed, Loadable, colors } from '../core';
import {
    fontCss, pageEffect, megaSpace, userAreaWidth, doubleSpace, tripleSpace, ActivityIndicator,
} from '../controls';
import { BookPathLink, CardLink } from './Navigation';

export function CurrentBookView({
    card, position, preview, page, theme,
}: Themed & {
    position: CurrentPosition,
    card: Loadable<LibraryCard>,
    preview: Loadable<string>,
    page: Loadable<string>,
}) {
    if (card.loading) {
        return null;
    }
    return <div css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: userAreaWidth,
        alignSelf: 'center',
        backgroundColor: colors(theme).primary,
        ...pageEffect(colors(theme).shadow),
    }}>
        <BookPathLink bookId={position.bookId} path={position.path}>
            <div css={{
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: megaSpace, paddingRight: megaSpace,
                alignItems: 'center',
            }}>
                <span css={{
                    marginTop: tripleSpace,
                    marginBottom: doubleSpace,
                    color: colors(theme).accent,
                    ...fontCss({
                        theme,
                        fontFamily: 'book',
                        fontSize: 'small',
                        bold: true,
                    }),
                    '&:hover': {
                        color: colors(theme).highlight,
                    },
                }}>
                    <CardLink bookId={card.id}>
                        {card.title}
                    </CardLink>
                </span>
                {
                    preview.loading
                        ? <ActivityIndicator theme={theme} />
                        : <Preview
                            theme={theme}
                            text={preview}
                        />
                }
                <span css={{
                    color: colors(theme).accent,
                    marginTop: doubleSpace,
                    marginBottom: tripleSpace,
                    ...fontCss({
                        theme,
                        fontFamily: 'book',
                        fontSize: 'small',
                    }),
                }}>
                    {page.loading ? '' : page}
                </span>
            </div>
        </BookPathLink>
    </div>;
}

function Preview({ text, theme }: Themed & {
    text: string,
}) {
    return <p css={{
        display: '-webkit-box',
        WebkitLineClamp: 10,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'break-spaces',
        textAlign: 'justify',
        color: colors(theme).text,
        ...fontCss({
            theme,
            fontFamily: 'book',
            fontSize: 'small',
        }),
        margin: 0,
        padding: 0,
        textIndent: megaSpace,
    }}>
        {text}
    </p>;
}
