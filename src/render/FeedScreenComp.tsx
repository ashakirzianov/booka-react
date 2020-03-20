import React from 'react';

import { Collections } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';
import { Column } from '../controls';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <Column>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <Collections />
        <CurrentBook />
        <RecentBooks />
    </Column>;
}
