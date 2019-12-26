import React from 'react';
import { BookDesc } from 'booka-common';
import { Column } from './Layout';
import { Link } from './Router';

export type BookListProps = {
    books: BookDesc[],
};
export function BookListComp({ books }: BookListProps) {
    return <Column>
        {
            books.map((desc, idx) =>
                <BookItemComp key={idx} desc={desc} />
            )
        }
    </Column>;
}

type BookItemProps = {
    desc: BookDesc,
};
function BookItemComp({ desc }: BookItemProps) {
    return <Link
        to={`/book/${desc.id}`}
        style={{
            textDecoration: 'none',
            color: undefined,
        }}
    >
        <Column
            centered
            width={200} height={200}
        >
            <BookCoverComp {...desc} />
            <BookTitleComp {...desc} />
        </Column>
    </Link>;
}

function BookCoverComp(desc: BookDesc) {
    if (desc.coverUrl) {
        return <BookImageCover {...desc} />;
    } else {
        return <BookEmptyCover {...desc} />;
    }
}

function BookImageCover({ coverUrl, title }: BookDesc) {
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

function BookEmptyCover({ title }: BookDesc) {
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

function BookTitleComp({ title }: BookDesc) {
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
