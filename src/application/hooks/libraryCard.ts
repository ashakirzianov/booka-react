import { useState, useEffect, useCallback } from 'react';
import { LibraryCard } from 'booka-common';
import { Loadable } from '../../core';
import { useDataProvider } from './dataProvider';
import { useAppDispatch } from './redux';

export type LibraryCardState = Loadable<LibraryCard>;
export function useLibraryCard(bookId: string) {
    const data = useDataProvider();
    const [card, setCardState] = useState<LibraryCardState>({ loading: true });
    useEffect(() => {
        const sub = data.cardForId(bookId).subscribe(setCardState);
        return () => sub.unsubscribe();
    }, [data, bookId]);

    return card;
}

export function useSetLibraryCard() {
    const dispatch = useAppDispatch();
    return useCallback((card: string | undefined) => dispatch({
        type: 'location-update-card',
        payload: card,
    }), [dispatch]);
}
