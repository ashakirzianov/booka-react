import React from 'react';

import { Screen } from '../controls';
import { useTheme } from '../application';
import { FeedLocation } from '../ducks';
import { ReadingList, UploadedList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';
import { PopularBooks } from './PopularBooks';

export function FeedScreen({ location }: {
    location: FeedLocation,
}) {
    const theme = useTheme();
    const query = location.search;
    const card = location.card;
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
