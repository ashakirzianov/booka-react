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
        flexShrink: 0,
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
        flexGrow: 1,
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
    const count = title.length / 10;
    const width = bookCoverWidth / maxLength;
    const height = bookCoverHeight / count * 0.75;
    const size = Math.floor(Math.min(width, height));
    return `${size}px`;
}

function colorForString(s: string) {
    // TODO: more & better colors
    const coverColors: Array<{ back: Color, text: Color }> = [
        {
            back: 'linear-gradient(90deg, #FDBB2D 0%, #22C1C3 100%)',
            text: 'white',
        },
        {
            back: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)',
            text: 'white',
        },
        {
            back: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
            text: 'steelblue',
        },
        {
            back: 'linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)',
            text: 'white',
        },
        {
            back: 'linear-gradient(90deg, #fcff9e 0%, #c67700 100%)',
            text: 'white',
        },
        {
            back: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)',
            text: 'white',
        },
    ];

    const rand = s
        .split('')
        .reduce((n, ch) => n + ch.charCodeAt(0), s.length);
    const idx = rand % coverColors.length;

    return coverColors[idx];
}
