import { useState, useEffect } from 'react';
import { CardCollection, CardCollectionName } from 'booka-common';
import { Loadable } from './utils';
import { useDataProvider } from './dataProvider';

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
