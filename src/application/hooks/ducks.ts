import { useCallback } from 'react';
import { doFbLogout } from '../facebookSdk';
import {
    useAppSelector, useDispatchCallback, useAppDispatch,
} from './redux';
import { CardCollectionName, LibraryCard } from 'booka-common';
import { Loadable } from '../../core';

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
    const addBookmark = useDispatchCallback('bookmarks-req-add');
    const removeBookmark = useDispatchCallback('bookmarks-req-remove');
    return { bookmarks, addBookmark, removeBookmark };
}

export function useCollection(name: CardCollectionName) {
    const collectionsState: Loadable<LibraryCard[]> =
        useAppSelector(s => s.collections[name]) ?? { loading: true };
    const dispatch = useAppDispatch();
    const addToCollection = useCallback((card: LibraryCard) => dispatch({
        type: 'collections-req-add',
        payload: { name, card },
    }), [name, dispatch]);
    const removeFromCollection = useCallback((bookId: string) => dispatch({
        type: 'collections-req-remove',
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
    const addHighlight = useDispatchCallback('highlights-req-add');
    const removeHighlight = useDispatchCallback('highlights-req-remove');
    const updateHighlightGroup = useDispatchCallback('highlights-req-change-group');
    return { addHighlight, removeHighlight, updateHighlightGroup };
}

export function usePositions() {
    const positions = useAppSelector(s => s.positions);
    const addCurrentPosition = useDispatchCallback('positions-req-add');
    return { positions, addCurrentPosition };
}
