import React from 'react';
import { View } from 'react-native';

import { ReadingList } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <View>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <RecentBooks />
        <ReadingList />
    </View>;
}
