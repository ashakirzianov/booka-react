import { useCallback } from 'react';
import {
    CardCollectionName, LibraryCard, BookPath, localBookmark,
    HighlightGroup, localHighlight, Highlight,
} from 'booka-common';
import { config } from '../../config';
import { Loadable } from '../../core';
import { doFbLogout } from '../facebookSdk';
import { useAppSelector, useAppDispatch } from './redux';

export function useAccount() {
    return useAppSelector(s => s.account);
}

export function useLogout() {
    const dispatch = useAppDispatch();
    return useCallback(() => {
        dispatch({
            type: 'account/logout',
        });
        doFbLogout();
    }, [dispatch]);
}

export function useBookmarks() {
    return useAppSelector(s => s.bookmarks);
}

export function useBookmarksActions() {
    const dispatch = useAppDispatch();
    const addBookmark = useCallback((bookId: string, path: BookPath) => dispatch({
        type: 'bookmarks/add',
        payload: localBookmark({ bookId, path }),
    }), [dispatch]);
    const removeBookmark = useCallback((bookmarkId: string) => dispatch({
        type: 'bookmarks/remove',
        payload: { bookmarkId },
    }), [dispatch]);
    return { addBookmark, removeBookmark };
}

export function useCollection(name: CardCollectionName): Loadable<LibraryCard[]> {
    return useAppSelector(s => s.collections[name]) ?? { loading: true };
}

export function useCollectionActions(name: CardCollectionName) {
    const dispatch = useAppDispatch();
    const addToCollection = useCallback((card: LibraryCard) => dispatch({
        type: 'collections/add',
        payload: { name, card },
    }), [name, dispatch]);
    const removeFromCollection = useCallback((bookId: string) => dispatch({
        type: 'collections/remove',
        payload: { name, bookId },
    }), [name, dispatch]);

    return {
        addToCollection,
        removeFromCollection,
    };
}

export function useHighlights() {
    return useAppSelector(s => s.highlights);
}

export function useHighlightsActions() {
    const dispatch = useAppDispatch();
    const addHighlight = useCallback((data: Omit<Highlight, 'uuid'>) => dispatch({
        type: 'highlights/add',
        payload: localHighlight(data),
    }), [dispatch]);
    const removeHighlight = useCallback((highlightId: string) => dispatch({
        type: 'highlights/remove',
        payload: { highlightId },
    }), [dispatch]);
    const updateHighlightGroup = useCallback((highlightId: string, group: HighlightGroup) => dispatch({
        type: 'highlights/change-group',
        payload: { highlightId, group },
    }), [dispatch]);
    return { addHighlight, removeHighlight, updateHighlightGroup };
}

export function usePositions() {
    return useAppSelector(s => s.positions);
}

export function usePositionsActions() {
    const dispatch = useAppDispatch();
    const source = config().source;
    const addCurrentPosition = useCallback((bookId: string, path: BookPath) => dispatch({
        type: 'positions/add',
        payload: {
            bookId, path, source,
            created: new Date(Date.now()),
        },
    }), [dispatch, source]);
    return { addCurrentPosition };
}

export function usePopularBooks() {
    return useAppSelector(s => s.popular);
}
