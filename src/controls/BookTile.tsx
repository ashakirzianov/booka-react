// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { LibraryCard } from 'booka-common';
import { ShowCardLink } from './Navigation';
import {
    Themed, colors, getFontFamily, getFontSize, Color,
} from '../application';
import { Style } from './common';

export function BookTile({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    return <ShowCardLink bookId={card.id}>
        <View style={{
            width: 200,
            height: 240,
            alignItems: 'center',
        }}>
            <BookCover
                theme={theme}
                card={card}
            />
            <BookTitle
                theme={theme}
                title={card.title}
                author={card.author}
            />
        </View>
    </ShowCardLink>;
}

function BookCover({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    if (card.coverUrl) {
        return <BookImageCover
            imageUrl={card.smallCoverUrl}
            title={card.title}
        />;
    } else {
        return <BookEmptyCover
            theme={theme}
            title={card.title}
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
        height: 180,
        width: 120,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        paddingTop: '20px',
        paddingLeft: '5px',
        paddingRight: '5px',
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
    const width = 200 / maxLength;
    const height = 180 / 2 / count;
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
            {title ?? '<no-title>'}
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
