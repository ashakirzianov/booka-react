// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, Color,
} from './theme';
import {
    Style, actionCss, actionHoverCss, regularSpace, bookCoverHeight, bookCoverWidth,
} from './common';

export function BookTile({
    title, author, coverUrl, showTitle, hideShadow, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
    showTitle?: boolean,
    hideShadow?: boolean,
}) {
    return <div css={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexGrow: 0,
        width: bookCoverWidth,
        margin: regularSpace,
        alignItems: 'center',
        color: colors(theme).text,
        fontFamily: theme.fontFamilies.book,
        '&:hover': {
            color: colors(theme).highlight,
        },
    }}>
        <BookCover
            theme={theme}
            title={title}
            author={author}
            coverUrl={coverUrl}
            showShadow={hideShadow ? false : true}
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
    title, coverUrl, showShadow, theme,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
    showShadow: boolean,
}) {
    if (coverUrl) {
        return <BookImageCover
            theme={theme}
            imageUrl={coverUrl}
            title={title}
            showShadow={showShadow}
        />;
    } else {
        return <BookEmptyCover
            theme={theme}
            title={title}
            showShadow={showShadow}
        />;
    }
}

function BookImageCover({ theme, imageUrl, title, showShadow }: Themed & {
    imageUrl: string | undefined,
    title: string,
    showShadow: boolean,
}) {
    return <div style={{
        height: bookCoverHeight,
        width: bookCoverWidth,
    }}>
        <img
            src={imageUrl}
            alt={title}
            css={{
                maxHeight: '100%',
                maxWidth: '100%',
                ...(showShadow
                    ? actionCss({ theme })
                    : {}),
                '&:hover': {
                    ...(showShadow
                        ? actionHoverCss({ theme })
                        : {}),
                },
            }}
        />
    </div>;
}

function BookEmptyCover({ title, showShadow, theme }: Themed & {
    title: string,
    showShadow: boolean,
}) {
    const { back, text } = colorForString(title);
    return <div css={{
        height: bookCoverHeight,
        width: bookCoverWidth,
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
        ...(showShadow
            ? actionCss({ theme })
            : {}),
        '&:hover': {
            ...(showShadow
                ? actionHoverCss({ theme })
                : {}),
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
    const width = bookCoverWidth / maxLength;
    const height = bookCoverHeight / 2 / count;
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
                fontSize: theme.fontSizes.xsmall,
                fontStyle: 'italic',
                fontWeight: 100,
            },
        ]}>
            {author}
        </span>
        <span css={[
            overflowLine,
            {
                fontSize: theme.fontSizes.xsmall,
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
