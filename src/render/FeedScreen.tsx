import React from 'react';

import { Screen } from '../controls';
import { ReadingList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';
import { useTheme } from '../application';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    const { theme } = useTheme();
    return <Screen theme={theme}>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <RecentBooks />
        <ReadingList />
    </Screen>;
}
