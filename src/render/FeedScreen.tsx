import React from 'react';

import { Screen } from '../controls';
import { ReadingList, UploadedList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';
import { useTheme, useUrlQuery } from '../application';
import { PopularBooks } from './PopularBooks';

export function FeedScreen() {
    const { theme } = useTheme();
    const { card, query } = useUrlQuery();
    return <Screen theme={theme}>
        <LibraryCardModal bookId={card} />
        <TopBar query={query} />
        <CurrentBook />
        <RecentBooks />
        <UploadedList />
        <ReadingList />
        <PopularBooks />
    </Screen>;
}
