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

export function FeedScreen({ location: { search, card } }: {
    location: FeedLocation,
}) {
    const theme = useTheme();
    return <Screen theme={theme}>
        <LibraryCardModal bookId={card} />
        <TopBar query={search} />
        <CurrentBook />
        <RecentBooks />
        <UploadedList />
        <ReadingList />
        <PopularBooks />
    </Screen>;
}
