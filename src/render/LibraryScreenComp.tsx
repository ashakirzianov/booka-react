import * as React from 'react';
import { BookDesc } from 'booka-common';

import { Column, TextLine } from '../atoms';
import { defaultTheme } from '../core';

type BookItemProps = {
    desc: BookDesc,
};
function BookItemComp({ desc }: BookItemProps) {
    return <Column>
        <TextLine
            theme={defaultTheme}
            text={desc.title}
        />
    </Column>
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
    </Column>
}

export function LibraryScreenComp() {
    // TODO: wire
    return <AllBooksComp books={[]} />
}
