import * as React from 'react';
import { BookDesc } from 'booka-common';

import {
    Themed, TopBar, point, Triad, EmptyLine,
    BookListComp,
} from '../atoms';
import { ConnectedAccountButton } from './AccountButton';

export type LibraryScreenProps = Themed & {
    books: BookDesc[],
};
export function LibraryScreenComp({ theme, books }: LibraryScreenProps) {
    return <>
        <LibraryScreenHeader theme={theme} />
        <EmptyLine />
        <BookListComp books={books} />
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
