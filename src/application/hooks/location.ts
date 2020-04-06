import { useCallback } from 'react';
import { BookRange, BookPath } from 'booka-common';
import { useAppSelector, useAppDispatch } from './redux';

export function useAppLocation() {
    return useAppSelector(s => s.location);
}

export function useQuote() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.quote : undefined,
    );
}

export function useSetQuote() {
    const dispatch = useAppDispatch();
    const setQuote = useCallback((quote: BookRange | undefined) => dispatch({
        type: 'location-update',
        payload: { location: 'book', quote },
    }), [dispatch]);

    return setQuote;
}

export function usePath() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.path : undefined,
    );
}

export function useSetPath() {
    const dispatch = useAppDispatch();
    const setPath = useCallback((path: BookPath | undefined) => dispatch({
        type: 'location-update',
        payload: { location: 'book', path },
    }), [dispatch]);

    return setPath;
}

export function useSetTocOpen() {
    const dispatch = useAppDispatch();
    const setTocOpen = useCallback((open: boolean) => dispatch({
        type: 'location-update',
        payload: { location: 'book', toc: open },
    }), [dispatch]);

    return setTocOpen;
}

export function useSearchQuery() {
    return useAppSelector(
        s => s.location.location === 'feed'
            ? s.location.search : undefined,
    );
}

export function useSetSearchQuery() {
    const dispatch = useAppDispatch();
    const setSearchQuery = useCallback((search: string | undefined) => dispatch({
        type: 'location-update',
        payload: { location: 'feed', search },
    }), [dispatch]);

    return setSearchQuery;
}

export function useShowCardId() {
    return useAppSelector(
        s => s.location.location === 'feed'
            ? s.location.show : undefined,
    );
}

export function useSetShowCard() {
    const dispatch = useAppDispatch();
    const setShowCard = useCallback((bookId: string | undefined) => dispatch({
        type: 'location-update',
        payload: { location: 'feed', show: bookId },
    }), [dispatch]);

    return setShowCard;
}
