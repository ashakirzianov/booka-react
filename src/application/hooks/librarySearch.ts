import { useState, useEffect } from 'react';
import { map } from 'rxjs/operators';
import { SearchResult } from 'booka-common';
import { Loadable } from './utils';
import { useDataProvider } from './dataProvider';
import { useUrlActions } from './url';

export type SearchState = Loadable<{
    results: SearchResult[],
}>;
export function useLibrarySearch(query: string | undefined) {
    const data = useDataProvider();
    const [searchState, setSearchState] = useState<SearchState>({ loading: true });
    useEffect(() => {
        setSearchState({ loading: true });
        const sub = data.librarySearch(query).pipe(
            map((results): SearchState => ({
                results,
            })),
        ).subscribe(setSearchState);
        return () => sub.unsubscribe();
    }, [data, query]);
    const { updateSearchQuery } = useUrlActions();

    return { searchState, doQuery: updateSearchQuery };
}
