// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { LibraryCard, BookPath } from 'booka-common';
import { Loadable, Themed, colors } from '../core';
import {
    tripleSpace, doubleSpace, fontCss,
    megaSpace, ActivityIndicator, point, multilineOverflowCss,
    panelShadow, radius,
} from '../controls';
import { CardLink, BookPathLink } from './Navigation';

export function BookPreview({
    card, bookId, path, preview, page, theme,
}: Themed & {
    bookId: string,
    path: BookPath,
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
        width: '75vw',
        maxWidth: point(40),
        alignSelf: 'center',
        backgroundColor: colors(theme).primary,
        ...panelShadow(colors(theme).shadow),
        // ...pageEffect(colors(theme).shadow),
        borderRadius: radius,
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
            <BookPathLink bookId={bookId} path={path}>
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
                            : <TextPreview
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

function TextPreview({ text, theme }: Themed & {
    text: string,
}) {
    return <p css={{
        ...multilineOverflowCss(10),
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
