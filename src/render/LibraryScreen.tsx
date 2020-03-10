import * as React from 'react';

import {
    Themed, TopBar, point, Triad, EmptyLine,
} from '../atoms';
import { useTheme } from '../application';
import { ConnectedAccountButton } from './AccountButton';
import { LibrarySearchConnected } from './LibrarySearchComp';
import { CollectionsConnected } from './CollectionsComp';
import { RecentBooksConnected } from './RecentBooksComp';

export function LibraryScreen() {
    const theme = useTheme();
    return <>
        <LibraryScreenHeader theme={theme} />
        <EmptyLine />
        <LibrarySearchConnected />
        <CollectionsConnected />
        <RecentBooksConnected />
    </>;
}

type LibraryScreenHeaderProps = Themed;
function LibraryScreenHeader({ theme }: LibraryScreenHeaderProps) {
    return <TopBar
        theme={theme}
        open={true}
        paddingHorizontal={point(1)}
    >
        <Triad
            right={<ConnectedAccountButton />}
        />
    </TopBar>;
}
