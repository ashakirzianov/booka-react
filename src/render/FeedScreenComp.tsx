import * as React from 'react';

import {
    Header, point, Triad, EmptyLine,
} from '../atoms';
import { useTheme, Themed } from '../application';
import { AccountButton } from './AccountButton';
import { CollectionsComp } from './CollectionsComp';
import { RecentBooksComp } from './RecentBooksComp';
import { LibraryCardComp } from './LibraryCardComp';
import { TopBar } from './TopBar';

export function FeedScreen({ show, query }: {
    query: string | undefined,
    show: string | undefined,
}) {
    const { theme } = useTheme();
    return <>
        {show ? <LibraryCardComp bookId={show} /> : null}
        <FeedScreenHeader theme={theme} />
        <EmptyLine />
        <TopBar query={query} />
        <CollectionsComp />
        <RecentBooksComp />
    </>;
}

function FeedScreenHeader({ theme }: Themed) {
    return <Header
        theme={theme}
        open={true}
        paddingHorizontal={point(1)}
    >
        <Triad
            right={<AccountButton />}
        />
    </Header>;
}
