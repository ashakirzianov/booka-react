// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { LibraryCard } from 'booka-common';
import { ShowCardLink } from './Navigation';
import { Themed, colors, getFontFamily, getFontSize } from '../application';
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
            <BookCover card={card} />
            <BookTitle
                theme={theme}
                title={card.title}
                author={card.author}
            />
        </View>
    </ShowCardLink>;
}

function BookCover({ card }: {
    card: LibraryCard,
}) {
    if (card.coverUrl) {
        return <BookImageCover
            imageUrl={card.smallCoverUrl}
            title={card.title}
        />;
    } else {
        return <BookEmptyCover title={card.title} />;
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

function BookEmptyCover({ title }: {
    title: string,
}) {
    return <div style={{
        height: 180,
        width: 120,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: '2em',
        background: randomColor(),
        color: randomColor(),
    }}>
        {title}
    </div>;
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

function randomColor(): string {
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;
    return `rgb(${red}, ${green}, ${blue})`;
}
