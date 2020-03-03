import React from 'react';
import { pathLessThan, BookPath, ResolvedCurrentPosition } from 'booka-common';
import { linkToString, BookLink } from '../core';
import { CurrentPositionsState } from '../ducks';
import { useTheme, useAppSelector } from '../application';
import {
    Column, Themed, Callback, WithChildren, navigate,
} from '../atoms';

export function RecentBooksConnected() {
    const state = useAppSelector(s => s.currentPositions);
    const openBook = React.useCallback((link: BookLink) => navigate(linkToString(link)), []);

    const theme = useTheme();

    return <RecentBooksComp
        theme={theme}
        state={state}
        onBookNavigate={openBook}
    />;
}

type RecentBooksProps = Themed & {
    state: CurrentPositionsState,
    onBookNavigate: Callback<BookLink>,
};
function RecentBooksComp({ state, onBookNavigate }: RecentBooksProps) {
    return <Column>
        <span key='label'>Recent books: {state.length}</span>
        {
            state.map((recentBook, idx) => {
                return <CurrentBookComp
                    key={idx}
                    currentPosition={recentBook}
                    onBookNavigate={onBookNavigate}
                />;
            })
        }
    </Column>;
}

function CurrentBookComp({ currentPosition: recentBook, onBookNavigate, }: {
    currentPosition: ResolvedCurrentPosition,
    onBookNavigate: Callback<BookLink>,
}) {
    if (recentBook.locations.length === 0) {
        return null;
    }
    const mostRecent = getMostRecentLocation(recentBook.locations);
    const farthest = getFarthestLocation(recentBook.locations);
    if (mostRecent === farthest) {
        return <Column>
            <span>Title: {recentBook.card.title}</span>
            <span>Recent and furthest</span>
            <span>{mostRecent.preview?.substr(0, 300)}</span>
            <NavigationLink
                bookId={recentBook.card.id}
                path={mostRecent.path}
                onBookNavigate={onBookNavigate}
            >
                Continue
            </NavigationLink>
        </Column>;
    } else {
        return <Column>
            <span>Title: {recentBook.card.title}</span>
            <span>Recent</span>
            <span>{mostRecent.preview?.substr(0, 300)}</span>
            <NavigationLink
                bookId={recentBook.card.id}
                path={mostRecent.path}
                onBookNavigate={onBookNavigate}
            >
                Continue
            </NavigationLink>
            <span>Furthest</span>
            <span>{farthest.preview?.substr(0, 300)}</span>
            <NavigationLink
                bookId={recentBook.card.id}
                path={farthest.path}
                onBookNavigate={onBookNavigate}
            >
                Continue
            </NavigationLink>
        </Column>;
    }
}

type RecentBookLocation = ResolvedCurrentPosition['locations'][0];
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

function NavigationLink({ bookId, path, onBookNavigate, children }: WithChildren<{
    bookId: string,
    path: BookPath,
    onBookNavigate: Callback<BookLink>,
}>) {
    return <span
        onClick={() => onBookNavigate({
            link: 'book',
            bookId, path,
        })}
        style={{
            cursor: 'pointer',
            color: 'blue',
        }}
    >
        {children}
    </span>;
}
