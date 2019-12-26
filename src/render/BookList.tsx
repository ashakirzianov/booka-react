// TODO: move to 'atoms'
import React from 'react';
import { BookDesc } from 'booka-common';
import { Column, TextLink } from '../atoms';
import { useTheme } from '../core';

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
    const theme = useTheme();
    return <Column centered>
        <BookCoverComp
            coverUrl={desc.coverUrl}
            title={desc.title}
        />
        <TextLink
            theme={theme}
            text={desc.title}
            to={`/book/${desc.id}`}
        />
    </Column>;
}

type BookCoverProps = {
    coverUrl?: string,
    title?: string,
};
function BookCoverComp({ coverUrl, title }: BookCoverProps) {
    if (coverUrl) {
        return <div
            style={{
                height: 180,
                width: 120,
            }}
        >
            <img
                src={coverUrl}
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
