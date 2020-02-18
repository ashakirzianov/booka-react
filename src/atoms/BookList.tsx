import React from 'react';
import { LibraryCard } from 'booka-common';
import { Column, Row } from './Layout';
import { Callback } from './common';

export type BookListProps = {
    books: LibraryCard[],
    onClick: Callback<LibraryCard>,
};
export function BookListComp({ books, onClick }: BookListProps) {
    return <Column>
        <Row
            maxWidth='100%'
            centered
        >
            {
                books.map((desc, idx) =>
                    <BookItemComp
                        key={idx}
                        card={desc}
                        onClick={onClick}
                    />
                )
            }
        </Row>
    </Column>;
}

type BookItemProps = {
    card: LibraryCard,
    onClick: Callback<LibraryCard>,
};
function BookItemComp({ card, onClick }: BookItemProps) {
    return <div
        onClick={() => onClick(card)}
        style={{
            cursor: 'pointer',
        }}
    >
        <Column
            centered
            width={200} height={200}
        >
            <BookCoverComp {...card} />
            <BookTitleComp {...card} />
        </Column>
    </div>;
}

export function BookCoverComp(card: LibraryCard) {
    if (card.coverUrl) {
        return <BookImageCover {...card} />;
    } else {
        return <BookEmptyCover {...card} />;
    }
}

function BookImageCover({ coverUrl, title }: LibraryCard) {
    return <div style={{
        height: 180,
        width: 120,
    }}>
        <img
            src={coverUrl}
            alt={title}
            style={{
                maxHeight: '100%',
                maxWidth: '100%',
            }}
        />
    </div>;
}

function BookEmptyCover({ title }: LibraryCard) {
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

function BookTitleComp({ title }: LibraryCard) {
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
