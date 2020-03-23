import React from 'react';

import { Screen } from '../controls';
import { ReadingList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <Screen>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <RecentBooks />
        <ReadingList />
    </Screen>;
}
