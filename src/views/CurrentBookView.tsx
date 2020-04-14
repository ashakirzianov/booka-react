// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { CurrentPosition, LibraryCard } from 'booka-common';
import { Themed, Loadable, colors } from '../core';
import { fontCss, pageEffect, megaSpace, point } from '../controls';

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
        maxWidth: point(40),
        alignSelf: 'center',
        backgroundColor: colors(theme).primary,
        ...pageEffect(colors(theme).shadow),
    }}>
        <div css={{
            display: 'flex',
            flexDirection: 'row',
            padding: megaSpace,
            alignItems: 'center',
        }}>
            <p css={{
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
            }}>{
                    preview.loading
                        ? 'loading...'
                        : preview.preview
                }</p>
        </div>
    </div>;
}
