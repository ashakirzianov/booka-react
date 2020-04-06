import { useState, useEffect, useCallback } from 'react';
import { LibraryCard } from 'booka-common';
import { Loadable } from './utils';
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

export function useLibraryCardActions() {
    const dispatch = useAppDispatch();
    const openCard = useCallback((cardId: string | undefined) => dispatch({
        type: 'location-update',
        payload: { location: 'feed', show: cardId },
    }), [dispatch]);

    return { openCard };
}
