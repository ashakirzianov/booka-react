// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontFamily, getFontSize, Color,
} from '../application';
import { Style } from './common';

export function BookTile({
    title, author, coverUrl, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
}) {
    return <View style={{
        width: 200,
        height: 240,
        alignItems: 'center',
    }}>
        <BookCover
            theme={theme}
            title={title}
            author={author}
            coverUrl={coverUrl}
        />
        <BookTitle
            theme={theme}
            title={title}
            author={author}
        />
    </View>;
}

function BookCover({
    title, coverUrl, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
}) {
    if (coverUrl) {
        return <BookImageCover
            imageUrl={coverUrl}
            title={title}
        />;
    } else {
        return <BookEmptyCover
            theme={theme}
            title={title}
        />;
    }
}

function BookImageCover({ imageUrl, title }: {
    imageUrl: string | undefined,
    title: string,
}) {
    return <div style={{
        height: 180,
        width: 120,
    }}>
        <img
            src={imageUrl}
            alt={title}
            style={{
                maxHeight: '100%',
                maxWidth: '100%',
            }}
        />
    </div>;
}

function BookEmptyCover({ title, theme }: Themed & {
    title: string,
}) {
    const { back, text } = colorForString(title);
    return <div css={{
        height: 160,
        width: 110,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        paddingTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: calcFontSize(title),
        fontFamily: getFontFamily(theme, 'menu'),
        background: back,
        color: text,
    }}>
        {title}
    </div>;
}

// TODO: rethink this
function calcFontSize(title: string) {
    const words = title
        .split(' ')
        .sort((a, b) => b.length - a.length);
    const maxLength = words[0]?.length ?? 0;
    const count = words.length;
    const width = 110 / maxLength;
    const height = 160 / 2 / count;
    const size = Math.min(width, height);
    return `${size}px`;
}

const overflowLine: Style = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};
function BookTitle({ title, author, theme }: Themed & {
    title: string,
    author: string | undefined,
}) {
    return <View style={{
        maxWidth: '100%',
    }}>
        <span css={[
            overflowLine,
            {
                color: colors(theme).accent,
                fontFamily: getFontFamily(theme, 'menu'),
                fontSize: getFontSize(theme, 'smallest'),
                fontStyle: 'italic',
                fontWeight: 100,
            },
        ]}>
            {author}
        </span>
        <span css={[
            overflowLine,
            {
                color: colors(theme).accent,
                fontFamily: getFontFamily(theme, 'menu'),
                fontSize: getFontSize(theme, 'smallest'),
                fontWeight: 900,
            },
        ]}>
            {title || '<no-title>'}
        </span>
    </View>;
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
