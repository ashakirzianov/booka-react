import * as React from 'react';
import { BookDesc } from 'booka-common';

import { Column, TextLink, Themed, TopBar, point, Triad, EmptyLine } from '../atoms';
import { useTheme } from '../core';
import { ConnectedAccountButton } from './AccountButton';

export type LibraryScreenProps = Themed & {
    books: BookDesc[],
};
export function LibraryScreenComp({ theme, books }: LibraryScreenProps) {
    return <>
        <LibraryScreenHeader theme={theme} />
        <EmptyLine />
        <AllBooksComp books={books} />
    </>;
}

type BookItemProps = {
    desc: BookDesc,
};
function BookItemComp({ desc }: BookItemProps) {
    const theme = useTheme();
    return <Column>
        <TextLink
            theme={theme}
            text={desc.title}
            to={`/book/${desc.id}`}
        />
    </Column>;
}

type AllBooksProps = {
    books: BookDesc[],
};
function AllBooksComp({ books }: AllBooksProps) {
    return <Column>
        {
            books.map((desc, idx) =>
                <BookItemComp key={idx} desc={desc} />
            )
        }
    </Column>;
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
