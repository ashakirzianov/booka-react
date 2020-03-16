import * as React from 'react';

import {
    Themed, TopBar, point, Triad, EmptyLine,
} from '../atoms';
import { useTheme } from '../application';
import { AccountButton } from './AccountButton';
import { LibrarySearchComp } from './LibrarySearchComp';
import { CollectionsComp } from './CollectionsComp';
import { RecentBooksConnected } from './RecentBooksComp';
import { LibraryCardComp } from './LibraryCard';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    const { theme } = useTheme();
    return <>
        {show ? <LibraryCardComp bookId={show} /> : null}
        <FeedScreenHeader theme={theme} />
        <EmptyLine />
        <LibrarySearchComp query={query} />
        <CollectionsComp />
        <RecentBooksConnected />
    </>;
}

function FeedScreenHeader({ theme }: Themed) {
    return <TopBar
        theme={theme}
        open={true}
        paddingHorizontal={point(1)}
    >
        <Triad
            right={<AccountButton />}
        />
    </TopBar>;
}
