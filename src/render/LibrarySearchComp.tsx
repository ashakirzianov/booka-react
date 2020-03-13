import React from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from 'lodash';

import { useSearchData } from '../application';
import {
    Column, SearchBox, BookListComp, ActivityIndicator,
} from '../atoms';
import { setSearchQuery } from './Navigation';

export function LibrarySearchComp({ query }: {
    query: string | undefined,
}) {
    const history = useHistory();
    const querySearch = React.useCallback(throttle((q: string) => {
        setSearchQuery(q, history);
    }, 300), [history]);

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
