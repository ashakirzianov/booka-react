import React from 'react';
import { LibraryCard } from 'booka-common';
import { Themed } from '../application';
import { BookTile, GridList } from '../controls';

export function BookList({ books, theme }: Themed & {
    books: LibraryCard[],
}) {
    return <GridList>
        {
            books.map((desc, idx) =>
                <BookTile
                    key={idx}
                    theme={theme}
                    card={desc}
                />
            )
        }
    </GridList>;
}
