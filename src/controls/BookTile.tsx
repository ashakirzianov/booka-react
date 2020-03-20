import React from 'react';
import { LibraryCard } from 'booka-common';
import { Column } from './Layout';
import { ShowCardLink } from './Navigation';
import { Themed, Loadable } from '../application';
import { ActivityIndicator } from './ActivityIndicator';

export function BookTile({ card, theme }: Themed & {
    card: Loadable<LibraryCard>,
}) {
    if (card.loading) {
        return <ActivityIndicator theme={theme} />;
    }
    return <ShowCardLink bookId={card.id}>
        <Column
            centered
            width={200} height={200}
        >
            <BookCover card={card} />
            <BookTitle title={card.title} />
        </Column>
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

function BookTitle({ title }: {
    title: string,
}) {
    return <div style={{
        display: 'block',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textDecoration: 'solid',
        color: 'blue',
    }}>
        {title ?? '<no-title>'}
    </div>;
}

function randomColor(): string {
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;
    return `rgb(${red}, ${green}, ${blue})`;
}
