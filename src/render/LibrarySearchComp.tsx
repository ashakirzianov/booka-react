import React from 'react';
import { throttle } from 'lodash';

import { useLibrarySearch, SearchState } from '../application';
import {
    Column, SearchBox, ActivityIndicator,
} from '../atoms';
import { BookListComp } from './BookList';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    const { state, doQuery } = useLibrarySearch(query);
    const querySearch = React.useCallback(throttle((q: string) => {
        doQuery(q ? q : undefined);
    }, 300), [doQuery]);

    return <Column>
        <SearchBox
            initial={query}
            onSearch={querySearch}
        />
        {query
            ? <SearchQueryComp state={state} />
            : null
        }
    </Column>;
}

function SearchQueryComp({ state }: {
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
