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
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <CardLink bookId={card.id}>
                <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    paddingTop: tripleSpace,
                    paddingBottom: doubleSpace,
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
                    {card.title}
                </div>
            </CardLink>
            <BookPathLink bookId={position.bookId} path={position.path}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingLeft: megaSpace,
                    paddingRight: megaSpace,
                }}>
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
        </div>
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
        padding: 0,
        margin: 0,
        textIndent: megaSpace,
    }}>
        {text}
    </p>;
}
