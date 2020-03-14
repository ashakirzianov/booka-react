import React from 'react';
import { throttle } from 'lodash';

import { useSearchData, useUrlActions } from '../application';
import {
    Column, SearchBox, ActivityIndicator,
} from '../atoms';
import { BookListComp } from './BookList';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    const { updateSearchQuery } = useUrlActions();
    const querySearch = React.useCallback(throttle((q: string) => {
        updateSearchQuery(q ? q : undefined);
    }, 300), [updateSearchQuery]);

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
