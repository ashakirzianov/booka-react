import { useState, useEffect, useCallback } from 'react';
import { map } from 'rxjs/operators';

import {
    AuthToken, Bookmark, Highlight, BookFragment, LibraryCard,
    SearchResult, CardCollection, BookPath, firstPath, CurrentPosition, CardCollectionName,
} from 'booka-common';
import { PaletteName } from '../core';
import { useUrlActions } from './urlHooks';
import { useAppSelector, useAppDispatch } from './reduxHooks';
import { doFbLogout } from './facebookSdk';
import { useDataProvider } from './dataProviderHooks';
import { Loadable } from './utils';

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

type PositionsState = CurrentPosition[];
export function usePositions() {
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
export function useBook({ bookId, path, refId }: {
    bookId: string,
    path?: BookPath,
    refId?: string,
}) {
    const data = useDataProvider();
    const [bookState, setBookState] = useState<BookState>({ loading: true });
    useEffect(() => {
        const observable = refId
            ? data.fragmentForRef(bookId, refId)
            : data.fragmentForPath(bookId, path || firstPath());
        const sub = observable
            .pipe(
                map((fragment): BookState => ({
                    fragment,
                })),
            )
            .subscribe(setBookState);
        return () => sub.unsubscribe();
    }, [data, bookId, path, refId]);

    return { bookState };
}

export type LibraryCardState = Loadable<LibraryCard>;
export function useLibraryCard(bookId: string) {
    const data = useDataProvider();
    const [card, setCardState] = useState<LibraryCardState>({ loading: true });
    useEffect(() => {
        const sub = data.cardForId(bookId).pipe(
        ).subscribe(setCardState);
        return () => sub.unsubscribe();
    }, [data, bookId]);

    const { updateShowCard } = useUrlActions();
    const closeCard = useCallback(
        () => updateShowCard(undefined),
        [updateShowCard],
    );

    return { card, closeCard };
}

export type SearchState = Loadable<{
    results: SearchResult[],
}>;
export function useLibrarySearch(query: string | undefined) {
    const data = useDataProvider();
    const [searchState, setSearchState] = useState<SearchState>({ loading: true });
    useEffect(() => {
        setSearchState({ loading: true });
        const sub = data.querySearch(query).pipe(
            map((results): SearchState => ({
                results,
            })),
        ).subscribe(setSearchState);
        return () => sub.unsubscribe();
    }, [data, query]);
    const { updateSearchQuery } = useUrlActions();

    return { searchState, doQuery: updateSearchQuery };
}

export function useAccount() {
    const accountState = useAppSelector(s => s.account);
    const dispatch = useAppDispatch();
    const logout = useCallback(() => {
        dispatch({
            type: 'account-logout',
        });
        doFbLogout();
    }, [dispatch]);
    return { accountState, logout };
}

export type CollectionsState = Loadable<CardCollection>;
export function useCollection(name: CardCollectionName) {
    const { collection, addToCollection, removeFromCollection } = useDataProvider();
    const [collectionsState, setCollectionsState] = useState<CollectionsState>({ loading: true });
    useEffect(() => {
        const sub = collection(name)
            .subscribe(setCollectionsState);
        return () => sub.unsubscribe();
    }, [collection, name]);

    return {
        collectionsState,
        addToCollection,
        removeFromCollection,
    };
}

export type TextPreviewState = Loadable<{
    preview: string | undefined,
}>;
export function usePreview(bookId: string, path: BookPath) {
    const data = useDataProvider();
    const [previewState, setPreviewState] = useState<TextPreviewState>({ loading: true });

    useEffect(() => {
        const sub = data.textPreview(bookId, path).pipe(
            map((preview): TextPreviewState => ({
                preview,
            })),
        ).subscribe(setPreviewState);
        return () => sub.unsubscribe();
    }, [data, bookId, path]);

    return { previewState };
}
