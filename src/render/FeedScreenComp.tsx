import * as React from 'react';

import { CollectionsComp } from './CollectionsComp';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <CollectionsComp />
    </>;
}
