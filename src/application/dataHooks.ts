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
import { PaletteName } from '../atoms';

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
    const dispatch = useAppDispatch();
    const setPalette = useCallback((name: PaletteName) => dispatch({
        type: 'theme-set-palette',
        payload: name,
    }), [dispatch]);
    const incrementScale = useCallback((inc: number) => dispatch({
        type: 'theme-increment-scale',
        payload: inc,
    }), [dispatch]);

    return { theme, setPalette, incrementScale };
}

type BookmarksState = Bookmark[];
export function useBookmarks(bookId: string, token?: AuthToken) {
    const { bookmarksForId, addBookmark, removeBookmark } = useDataProvider();
    const [bookmarks, setBookmarks] = useState<BookmarksState>([]);
    useEffect(() => {
        const sub = bookmarksForId(bookId).subscribe(setBookmarks);
        return () => sub.unsubscribe();
    }, [bookmarksForId, bookId]);
    return { bookmarks, addBookmark, removeBookmark };
}

type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const { highlightsForId, addHighlight, removeHighlight, updateHighlightGroup } = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    useEffect(() => {
        const sub = highlightsForId(bookId).subscribe(setHighlights);
        return () => sub.unsubscribe();
    }, [highlightsForId, bookId]);
    return {
        highlights,
        addHighlight,
        removeHighlight,
        updateHighlightGroup,
    };
}

type PositionsState = ResolvedCurrentPosition[];
export function usePositions(token?: AuthToken) {
    const { addCurrentPosition, currentPositions } = useDataProvider();
    const [positions, setPositions] = useState<PositionsState>([]);
    useEffect(() => {
        const sub = currentPositions().subscribe(setPositions);
        return () => sub.unsubscribe();
    }, [currentPositions]);
    return { positions, addCurrentPosition };
}

type BookState = Loadable<{
    fragment: BookFragment,
}>;
export function useBook(link: BookLink) {
    const data = useDataProvider();
    const [bookState, setBookState] = useState<BookState>({ state: 'loading' });
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
            .subscribe(setBookState);
        return () => sub.unsubscribe();
    }, [subject]);

    return { bookState };
}

export type LibraryCardState = Loadable<{
    card: LibraryCard,
}>;
export function useLibraryCard(bookId: string) {
    const data = useDataProvider();
    const [cardState, setCardState] = useState<LibraryCardState>({ state: 'loading' });
    const observable = useMemo(
        () => data.libraryCard({ bookId }),
        [data, bookId],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((card): LibraryCardState => ({
                state: 'ready', card,
            }))
        ).subscribe(setCardState);
        return () => sub.unsubscribe();
    }, [observable]);

    const { updateShowCard } = useUrlActions();
    const closeCard = useCallback(
        () => updateShowCard(undefined),
        [updateShowCard],
    );

    return { cardState, closeCard };
}

export type SearchState = Loadable<{
    results: SearchResult[],
}>;
export function useLibrarySearch(query: string | undefined) {
    const data = useDataProvider();
    const [searchState, setSearchState] = useState<SearchState>({ state: 'loading' });
    const { observable } = useMemo(
        () => data.search({ query }),
        [data, query],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((results): SearchState => ({
                state: 'ready', results,
            }))
        ).subscribe(setSearchState);
        return () => sub.unsubscribe();
    }, [observable]);
    const { updateSearchQuery } = useUrlActions();

    return { searchState, doQuery: updateSearchQuery };
}

export function useAccount() {
    const accountState = useAppSelector(s => s.account);
    const dispatch = useAppDispatch();
    const logout = useCallback(() => dispatch({
        type: 'account-logout',
    }), [dispatch]);
    return { accountState, logout };
}

export type CollectionsState = {
    collections: CardCollections,
};
export function useCollections() {
    const { collections, addToCollection, removeFromCollection } = useDataProvider();
    const [collectionsState, setCollectionsState] = useState<CollectionsState>({ collections: {} });
    useEffect(() => {
        const sub = collections().pipe(
            map((c): CollectionsState => ({
                collections: c,
            }))
        ).subscribe(setCollectionsState);
        return () => sub.unsubscribe();
    }, [collections]);

    return {
        collectionsState,
        addToCollection,
        removeFromCollection,
    };
}
