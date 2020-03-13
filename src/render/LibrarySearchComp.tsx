import React from 'react';

import { useSearchData } from '../application';
import {
    Column, SearchBox, BookListComp, ActivityIndicator,
} from '../atoms';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    // TODO: implement
    const querySearch = React.useCallback((q: string) => undefined, []);

    return <Column>
        <SearchBox
            initial={query}
            onSearch={querySearch}
        />
        {query
            ? <SearchQueryComp query={query} />
            : null
        }
    </Column>;
}

function SearchQueryComp({ query }: {
    query: string,
}) {
    const searchState = useSearchData(query);
    switch (searchState.state) {
        case 'error':
            return <span>Search error</span>;
        case 'loading':
            return <ActivityIndicator />;
        case 'ready':
            return <BookListComp books={searchState.results.map(r => r.desc)} />;
        default:
            return null;
    }
}
