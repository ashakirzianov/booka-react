import React from 'react';
import { View } from 'react-native';

import { Collections } from './Collections';
import { LibraryCardModal } from './LibraryCardModal';
import { TopBar } from './TopBar';
import { CurrentBook } from './CurrentBook';
import { RecentBooks } from './RecentBooks';
import { normalPadding } from '../controls';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    return <View style={{
        padding: normalPadding,
    }}>
        <LibraryCardModal bookId={show} />
        <TopBar query={query} />
        <CurrentBook />
        <RecentBooks />
        <Collections />
    </View>;
}
