// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, Color,
} from './theme';
import {
    bookCoverHeight, bookCoverWidth,
} from './common';

export function BookCover({
    title, coverUrl, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
}) {
    return <div title={title} style={{
        display: 'flex',
        flexShrink: 0,
        height: bookCoverHeight,
        width: bookCoverWidth,
        alignItems: 'stretch',
    }}>
        {
            coverUrl
                ? <BookImageCover
                    theme={theme}
                    imageUrl={coverUrl}
                    title={title}
                />
                : <BookEmptyCover
                    theme={theme}
                    title={title}
                />
        }
    </div>;
}

function BookImageCover({ theme, imageUrl, title }: Themed & {
    imageUrl: string | undefined,
    title: string,
}) {
    return <div title={title} style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }} />;
}

function BookEmptyCover({ title, theme }: Themed & {
    title: string,
}) {
    const { back, text } = colorForString(title);
    return <div title={title} css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    }}>
        <div css={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            paddingTop: 20,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: calcFontSize(title),
            fontFamily: theme.fontFamilies.menu,
            background: back,
            color: text,
        }}>
            {title}
        </div>
    </div>;
}

// TODO: rethink this
function calcFontSize(title: string) {
    const words = title
        .split(' ')
        .sort((a, b) => b.length - a.length);
    const maxLength = words[0]?.length ?? 0;
    const count = words.length;
    const width = bookCoverWidth / maxLength;
    const height = bookCoverHeight / 2 / count;
    const size = Math.min(width, height);
    return `${size}px`;
}

function colorForString(s: string) {
    // TODO: more & better colors
    const coverColors: Array<{ back: Color, text: Color }> = [
        { back: 'orange', text: 'white' },
        { back: 'gold', text: 'white' },
        { back: 'olive', text: 'white' },
        { back: 'indigo', text: 'white' },
        { back: 'steelblue', text: 'white' },
        { back: 'brown', text: 'white' },
        { back: 'brown', text: 'black' },
        { back: 'pink', text: 'red' },
        { back: 'salmon', text: 'red' },
    ];

    const rand = s
        .split('')
        .reduce((n, ch) => n + ch.charCodeAt(0), 0);
    const idx = rand % coverColors.length;

    return coverColors[idx];
}
