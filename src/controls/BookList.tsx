import React from 'react';
import { LibraryCard } from 'booka-common';
import { Themed } from '../application';
import { Column, Row } from './Layout';
import { BookTile } from './BookTile';

export function BookList({ books }: Themed & {
    books: LibraryCard[],
}) {
    return <Column>
        <Row
            maxWidth='100%'
            centered
        >
            {
                books.map((desc, idx) =>
                    <BookTile
                        key={idx}
                        card={desc}
                    />
                )
            }
        </Row>
    </Column>;
}
