import React from 'react';
import { pathLessThan } from 'booka-common';
import {
    RecentBooksState, RecentBook, RecentBookLocation,
} from '../ducks';
import { useTheme, useAppSelector } from '../core';
import {
    Column, Themed, BookLink,
} from '../atoms';

export function RecentBooksConnected() {
    const state = useAppSelector(s => s.recentBooks);

    const theme = useTheme();

    return <RecentBooksComp
        theme={theme}
        state={state}
    />;
}

type RecentBooksProps = Themed & {
    state: RecentBooksState,
};
function RecentBooksComp({ state }: RecentBooksProps) {
    return <Column>
        <span key='label'>Recent books: {state.length}</span>
        {
            state.map((recentBook, idx) => {
                return <RecentBookComp
                    key={idx}
                    recentBook={recentBook}
                />;
            })
        }
    </Column>;
}

function RecentBookComp({ recentBook }: { recentBook: RecentBook }) {
    if (recentBook.locations.length === 0) {
        return null;
    }
    const mostRecent = getMostRecentLocation(recentBook.locations);
    const farthest = getFarthestLocation(recentBook.locations);
    // TODO: use proper book links
    if (mostRecent === farthest) {
        return <Column>
            <span>Id: {recentBook.id}</span>
            <BookLink
                bookId={recentBook.id}
                path={mostRecent.path}
            >
                Recent and furthest
            </BookLink>
        </Column>;
    } else {
        return <Column>
            <span>Id: {recentBook.id}</span>
            <BookLink
                bookId={recentBook.id}
                path={mostRecent.path}
            >
                Recent
            </BookLink>
            <BookLink
                bookId={recentBook.id}
                path={farthest.path}
            >
                Farthest
            </BookLink>
        </Column>;
    }
}

function getMostRecentLocation(rbls: RecentBookLocation[]): RecentBookLocation {
    return rbls.reduce(
        (last, curr) =>
            curr.created > last.created ? curr : last
    );
}

function getFarthestLocation(rbls: RecentBookLocation[]): RecentBookLocation {
    return rbls.reduce(
        (farthest, curr) =>
            pathLessThan(farthest.path, curr.path) ? curr : farthest
    );
}
