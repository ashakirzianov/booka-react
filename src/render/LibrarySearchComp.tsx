import React from 'react';

import { useSearchData, SearchState } from '../application';
import {
    Column, SearchBox, BookListComp, ActivityIndicator,
} from '../atoms';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    const searchState = useSearchData(query);

    // TODO: implement
    const querySearch = React.useCallback((q: string) => undefined, []);

    return <Column>
        <SearchBox
            initial={query}
            onSearch={querySearch}
        />
        <SearchStateComp
            state={searchState}
        />
    </Column>;
}

function SearchStateComp({ state }: {
    state: SearchState,
}) {
    switch (state.state) {
        case 'error':
            return <span>Search error</span>;
        case 'loading':
            return <ActivityIndicator />;
        case 'ready':
            return <BookListComp books={state.results.map(r => r.desc)} />;
        default:
            return null;
    }
}
