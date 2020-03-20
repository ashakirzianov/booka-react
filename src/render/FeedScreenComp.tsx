import * as React from 'react';

import { CollectionsComp } from './CollectionsComp';
import { LibraryCardComp } from './LibraryCardComp';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <>
        <CurrentCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <CollectionsComp />
    </>;
}

function CurrentCardModal({ bookId }: {
    bookId: string | undefined,
}) {
    return bookId
        ? <LibraryCardComp bookId={bookId} />
        : null;
}
