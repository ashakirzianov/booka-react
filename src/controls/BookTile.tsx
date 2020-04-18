// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors,
} from './theme';
import {
    bookCoverWidth, panelShadow, tripleSpace, radius, fontCss,
    regularSpace, singleLineOverflowCss,
} from './common';
import { BookCover } from './BookCover';

export function BookTile({
    title, author, coverUrl, showTitle, theme, callback,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
    showTitle?: boolean,
    callback?: () => void,
}) {
    return <div title={title} css={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 0,
        width: bookCoverWidth,
        margin: tripleSpace,
        borderRadius: radius,
        backgroundColor: colors(theme).primary,
        overflow: 'hidden',
        ...panelShadow(colors(theme).shadow),
        color: colors(theme).accent,
        fontFamily: theme.fontFamilies.book,
        '&:hover': {
            color: colors(theme).highlight,
        },
    }}>
        <div title={title} css={{
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
        }}
            onClick={callback}
        >
            <BookCover
                theme={theme}
                title={title}
                author={author}
                coverUrl={coverUrl}
            />
            {
                !showTitle ? null :
                    <BookTitle
                        theme={theme}
                        title={title}
                        author={author}
                    />
            }
        </div >
    </div>;
}

function BookTitle({ title, author, theme }: Themed & {
    title: string,
    author: string | undefined,
}) {
    return <div css={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        maxWidth: bookCoverWidth,
        padding: regularSpace,
        ...fontCss({ theme, fontSize: 'xsmall' }),
    }}>
        <span css={{
            maxWidth: '90%',
            fontWeight: 500,
            ...singleLineOverflowCss(),
        }}>{title}</span>
        <span css={{
            maxWidth: '90%',
            ...singleLineOverflowCss(),
        }}>{author ?? '\u00a0'}</span>
    </div>;
}
