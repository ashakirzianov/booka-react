import React from 'react';

import { Screen } from '../controls';
import { useTheme } from '../application';
import { ReadingList, UploadedList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { AppBar } from './AppBar';
import { SearchResults } from './SearchResults';
import { ReadingHistory } from './ReadingHistory';
import { PopularBooks } from './PopularBooks';

export function FeedScreen() {
    const theme = useTheme();
    return <Screen theme={theme}>
        <LibraryCardModal />
        <AppBar />
        <PopularBooks />
        <SearchResults />
        <ReadingHistory />
        <UploadedList />
        <ReadingList />
    </Screen>;
}
