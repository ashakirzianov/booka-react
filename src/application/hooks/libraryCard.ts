import { useState, useEffect, useCallback } from 'react';
import { LibraryCard } from 'booka-common';
import { Loadable } from './utils';
import { useDataProvider } from './dataProvider';
import { useUrlActions } from './url';

export type LibraryCardState = Loadable<LibraryCard>;
export function useLibraryCard(bookId: string) {
    const data = useDataProvider();
    const [card, setCardState] = useState<LibraryCardState>({ loading: true });
    useEffect(() => {
        const sub = data.cardForId(bookId).subscribe(setCardState);
        return () => sub.unsubscribe();
    }, [data, bookId]);

    const { updateShowCard } = useUrlActions();
    const closeCard = useCallback(
        () => updateShowCard(undefined),
        [updateShowCard],
    );

    return { card, closeCard };
}
