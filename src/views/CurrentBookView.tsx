// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { CurrentPosition, LibraryCard } from 'booka-common';
import { Themed, Loadable, colors } from '../core';
import {
    fontCss, pageEffect, megaSpace, userAreaWidth, regularSpace, doubleSpace, point, tripleSpace,
} from '../controls';
import { BookPathLink, CardLink } from './Navigation';

export function CurrentBookView({ card, position, preview, theme }: Themed & {
    position: CurrentPosition,
    card: Loadable<LibraryCard>,
    preview: Loadable<{ preview: string | undefined }>,
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
                paddingBottom: megaSpace,
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
                <Preview
                    theme={theme}
                    text={preview.loading ? 'loading...' : preview.preview ?? 'not available'}
                />
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
