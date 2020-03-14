import { useState, useEffect, useMemo, useCallback } from 'react';
import { map } from 'rxjs/operators';

import {
    AuthToken, Bookmark, Highlight, ResolvedCurrentPosition,
    BookFragment, LibraryCard, SearchResult, CardCollections,
} from 'booka-common';
import { dataProvider } from '../data';
import { BookLink } from '../core';
import { useUrlActions } from './urlHooks';
import { useAppSelector, useAppDispatch } from './reduxHooks';

type Loadable<T> =
    | { state: 'loading' }
    | { state: 'error', err?: any }
    | { state: 'ready' } & T
    ;

const dp = dataProvider();
function useDataProvider() {
    // TODO: get from context
    return dp;
}

export function useTheme() {
    const theme = useAppSelector(s => s.theme);
    // TODO: return { state } ?
    // TODO: return set theme action ?
    return theme;
}

type BookmarksState = Bookmark[];
export function useBookmarks(bookId: string, token?: AuthToken) {
    const data = useDataProvider();
    const [state, setState] = useState<BookmarksState>([]);
    const { subject, add, remove } = useMemo(
        () => data.bookmarksForId(bookId, token),
        [bookId, token, data],
    );
    useEffect(() => {
        const sub = subject.subscribe(setState);
        return () => sub.unsubscribe();
    }, [subject]);
    return { state, add, remove };
}

type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const data = useDataProvider();
    const [state, setState] = useState<HighlightsState>([]);
    const { subject, add, remove } = useMemo(
        () => data.highlightsForId(bookId, token),
        [bookId, token, data],
    );
    useEffect(() => {
        const sub = subject.subscribe(setState);
        return () => sub.unsubscribe();
    }, [subject]);
    return { state, add, remove };
}

type PositionsState = ResolvedCurrentPosition[];
export function usePositions(token?: AuthToken) {
    const data = useDataProvider();
    const [state, setState] = useState<PositionsState>([]);
    const { subject, add } = useMemo(
        () => data.currentPositions(token),
        [token, data],
    );
    useEffect(() => {
        const sub = subject.subscribe(setState);
        return () => sub.unsubscribe();
    }, [subject]);
    return { state, add };
}

type BookState = Loadable<{
    fragment: BookFragment,
}>;
export function useBook(link: BookLink) {
    const data = useDataProvider();
    const [state, setState] = useState<BookState>({ state: 'loading' });
    const subject = useMemo(
        () => data.openLink(link),
        [link, data],
    );
    useEffect(() => {
        const sub = subject
            .pipe(
                map((r): BookState => ({
                    state: 'ready',
                    fragment: r.fragment,
                })),
            )
            .subscribe(setState);
        return () => sub.unsubscribe();
    }, [subject]);

    return { state };
}

export type LibraryCardState = Loadable<{
    card: LibraryCard,
}>;
export function useLibraryCard(bookId: string) {
    const data = useDataProvider();
    const [state, setState] = useState<LibraryCardState>({ state: 'loading' });
    const { observable } = useMemo(
        () => data.libraryCard({ bookId }),
        [data, bookId],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((card): LibraryCardState => ({
                state: 'ready', card,
            }))
        ).subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    const { updateShowCard } = useUrlActions();
    const closeCard = useCallback(
        () => updateShowCard(undefined),
        [updateShowCard],
    );

    return { state, closeCard };
}

export type SearchState = Loadable<{
    results: SearchResult[],
}>;
export function useLibrarySearch(query: string | undefined) {
    const data = useDataProvider();
    const [state, setState] = useState<SearchState>({ state: 'loading' });
    const { observable } = useMemo(
        () => data.search({ query }),
        [data, query],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((results): SearchState => ({
                state: 'ready', results,
            }))
        ).subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);
    const { updateSearchQuery } = useUrlActions();

    return { state, doQuery: updateSearchQuery };
}

export function useAccount() {
    const state = useAppSelector(s => s.account);
    const dispatch = useAppDispatch();
    const logout = React.useCallback(() => dispatch({
        type: 'account-logout',
    }), [dispatch]);
    return { state, logout };
}

export type CollectionsState = {
    collections: CardCollections,
};
export function useCollections() {
    const data = useDataProvider();
    const [state, setState] = useState<CollectionsState>({ collections: {} });
    const { observable, add, remove } = useMemo(
        () => data.collections(),
        [data],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((collections): CollectionsState => ({
                collections,
            }))
        ).subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    return { state, add, remove };
}
