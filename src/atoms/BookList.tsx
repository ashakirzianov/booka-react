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

function BookCoverComp({ coverUrl, title }: BookDesc) {
    if (coverUrl) {
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
    } else {
        return null;
    }
}

function BookTitleComp({ title }: BookDesc) {
    return <div style={{
        display: 'block',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textDecoration: 'none',
    }}>
        {title ?? '<no-title>'}
    </div>;
}
