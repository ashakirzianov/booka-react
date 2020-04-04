import { useCallback } from 'react';
import {
    CardCollectionName, LibraryCard, BookPath, localBookmark,
    HighlightGroup, localHighlight, EntityData, Highlight,
} from 'booka-common';
import { Loadable } from '../../core';
import { config } from '../../config';
import { doFbLogout } from '../facebookSdk';
import { useAppSelector, useAppDispatch } from './redux';

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

export function useBookmarks() {
    const bookmarks = useAppSelector(s => s.bookmarks);
    const dispatch = useAppDispatch();
    const addBookmark = useCallback((bookId: string, path: BookPath) => dispatch({
        type: 'bookmarks-add',
        payload: localBookmark({ bookId, path }),
    }), [dispatch]);
    const removeBookmark = useCallback((bookmarkId: string) => dispatch({
        type: 'bookmarks-remove',
        payload: { bookmarkId },
    }), [dispatch]);
    return { bookmarks, addBookmark, removeBookmark };
}

export function useCollection(name: CardCollectionName) {
    const collectionsState: Loadable<LibraryCard[]> =
        useAppSelector(s => s.collections[name] ?? []) ?? { loading: true };
    const dispatch = useAppDispatch();
    const addToCollection = useCallback((card: LibraryCard) => dispatch({
        type: 'collections-add',
        payload: { name, card },
    }), [name, dispatch]);
    const removeFromCollection = useCallback((bookId: string) => dispatch({
        type: 'collections-remove',
        payload: { name, bookId },
    }), [name, dispatch]);

    return {
        collectionsState,
        addToCollection,
        removeFromCollection,
    };
}

export function useHighlights() {
    return useAppSelector(s => s.highlights);
}

export function useHighlightsActions() {
    const dispatch = useAppDispatch();
    const addHighlight = useCallback((data: EntityData<Highlight>) => dispatch({
        type: 'highlights-add',
        payload: localHighlight(data),
    }), [dispatch]);
    const removeHighlight = useCallback((highlightId) => dispatch({
        type: 'highlights-remove',
        payload: { highlightId },
    }), [dispatch]);
    const updateHighlightGroup = useCallback((highlightId: string, group: HighlightGroup) => dispatch({
        type: 'highlights-change-group',
        payload: { highlightId, group },
    }), [dispatch]);
    return { addHighlight, removeHighlight, updateHighlightGroup };
}

export function usePositions() {
    const positions = useAppSelector(s => s.positions);
    const dispatch = useAppDispatch();
    const source = config().source;
    const addCurrentPosition = useCallback((bookId: string, path: BookPath) => dispatch({
        type: 'positions-add',
        payload: {
            bookId, path, source,
            created: new Date(Date.now()),
        },
    }), [dispatch, source]);
    return { positions, addCurrentPosition };
}
