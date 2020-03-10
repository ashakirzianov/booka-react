import React from 'react';
import { LibraryCard } from 'booka-common';
import { Column, Row } from './Layout';
import { Link } from 'react-router-dom';

// TODO: move from atoms
export function BookListComp({ books }: {
    books: LibraryCard[],
}) {
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
                    />
                )
            }
        </Row>
    </Column>;
}

function BookItemComp({ card }: {
    card: LibraryCard,
}) {
    return <Link to={`/?show=${card.id}`}>
        <Column
            centered
            width={200} height={200}
        >
            <BookCoverComp card={card} />
            <BookTitleComp title={card.title} />
        </Column>
    </Link>;
}

export function BookCoverComp({ card }: {
    card: LibraryCard,
}) {
    if (card.coverUrl) {
        return <BookImageCover {...card} />;
    } else {
        return <BookEmptyCover {...card} />;
    }
}

// TODO: decouple props ?
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

function BookTitleComp({ title }: {
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
