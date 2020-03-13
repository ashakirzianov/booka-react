import React from 'react';
import { throttle } from 'lodash';

import { useSearchData } from '../application';
import {
    Column, SearchBox, ActivityIndicator,
} from '../atoms';
import { useHistoryAccess } from './Navigation';
import { BookListComp } from './BookList';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    const { replaceSearchParam } = useHistoryAccess();
    const querySearch = React.useCallback(throttle((q: string) => {
        replaceSearchParam('q', q ? q : undefined);
    }, 300), [replaceSearchParam]);

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
