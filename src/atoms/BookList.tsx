import React from 'react';
import { LibraryCard } from 'booka-common';
import { Column, Row } from './Layout';
import { BookLink } from './Router';

export type BookListProps = {
    books: LibraryCard[],
};
export function BookListComp({ books }: BookListProps) {
    return <Column>
        <Row
            maxWidth='100%'
            centered
        >
            {
                books.map((desc, idx) =>
                    <BookItemComp key={idx} desc={desc} />
                )
            }
        </Row>
    </Column>;
}

type BookItemProps = {
    desc: LibraryCard,
};
function BookItemComp({ desc }: BookItemProps) {
    return <BookLink
        bookId={desc.id}
    >
        <Column
            centered
            width={200} height={200}
        >
            <BookCoverComp {...desc} />
            <BookTitleComp {...desc} />
        </Column>
    </BookLink>;
}

export function BookCoverComp(desc: LibraryCard) {
    if (desc.coverUrl) {
        return <BookImageCover {...desc} />;
    } else {
        return <BookEmptyCover {...desc} />;
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
