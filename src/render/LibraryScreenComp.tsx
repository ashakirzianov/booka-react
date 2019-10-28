import * as React from 'react';
import { BookDesc } from 'booka-common';

import { Column, TextButton } from '../atoms';
import { useAppSelector, useTheme } from '../core';

type BookItemProps = {
    desc: BookDesc,
};
function BookItemComp({ desc }: BookItemProps) {
    const theme = useTheme();
    return <Column>
        <TextButton
            theme={theme}
            text={desc.title}
            to={`/book/${desc.id}`}
        />
    </Column>;
}

type AllBooksProps = {
    books: BookDesc[],
};
function AllBooksComp({ books }: AllBooksProps) {
    return <Column>
        {
            books.map((desc, idx) =>
                <BookItemComp key={idx} desc={desc} />
            )
        }
    </Column>;
}

export function LibraryScreenComp() {
    const books = useAppSelector(s => s.library.books);
    return <AllBooksComp books={books} />;
}
