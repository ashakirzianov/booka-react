import React from 'react';
import { pathLessThan } from 'booka-common';
import {
    RecentBooksState, RecentBook, RecentBookLocation,
} from '../ducks';
import { useTheme, useAppSelector } from '../core';
import {
    Column, Themed,
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
        return <span>Id: {`${recentBook.id}`}, path: {`${mostRecent}`}</span>;
    } else {
        return <span>Id: {`${recentBook.id}`}, recent: {`${mostRecent}`}, farthest: {`${farthest}`}</span>;
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
