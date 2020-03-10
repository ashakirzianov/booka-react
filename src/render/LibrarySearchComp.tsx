import React from 'react';
import { Callback } from 'booka-common';
import { SearchState } from '../ducks';
import { useAppDispatch, useTheme, useAppSelector } from '../application';
import {
    Column, SearchBox, BookListComp, ActivityIndicator, Themed,
} from '../atoms';
import { LibraryCardConnected } from './LibraryCardComp';

export function LibrarySearchConnected() {
    const dispatch = useAppDispatch();
    const searchState = useAppSelector(s => s.search);

    const querySearch = React.useCallback((query: string) => dispatch({
        type: 'search-query',
        payload: query,
    }), [dispatch]);
    const clearSearch = React.useCallback(() => dispatch({
        type: 'search-clear',
    }), [dispatch]);

    const theme = useTheme();

    return <LibrarySearchComp
        theme={theme}
        onSearch={querySearch}
        onClear={clearSearch}
        searchState={searchState}
    />;
}

function LibrarySearchComp({ searchState, onSearch, onClear, }: Themed & {
    onSearch: Callback<string>,
    onClear: Callback,
    searchState: SearchState,
}) {
    return <Column>
        <LibraryCardConnected />
        <SearchBox
            onSearch={onSearch}
            onClear={onClear}
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
        case 'empty':
        default:
            return null;
    }
}
