// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontFamily, getFontSize, Color,
} from '../application';
import { Style, actionShadow, margin } from './common';

export function BookTile({
    title, author, coverUrl, showTitle, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
    showTitle?: boolean,
}) {
    return <div css={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexGrow: 0,
        width: 160,
        margin: margin,
        alignItems: 'center',
        color: colors(theme).text,
        fontFamily: getFontFamily(theme, 'menu'),
        '&:hover': {
            color: colors(theme).highlight,
        },
    }}>
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
    </div>;
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
            theme={theme}
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

function BookImageCover({ theme, imageUrl, title }: Themed & {
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
            css={{
                maxHeight: '100%',
                maxWidth: '100%',
                boxShadow: actionShadow(colors(theme).shadow),
                '&:hover': {
                    boxShadow: actionShadow(colors(theme).highlight),
                },
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
        boxShadow: actionShadow(colors(theme).shadow),
        '&:hover': {
            boxShadow: actionShadow(colors(theme).highlight),
        },
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
