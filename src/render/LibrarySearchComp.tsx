import React from 'react';
import { Callback } from 'booka-common';
import { SearchState } from '../ducks';
import { useAppDispatch, useTheme, useAppSelector } from '../core';
import {
    Column, SearchBox, BookListComp, ActivityIndicator, Themed,
} from '../atoms';

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
        state={searchState}
    />;
}

type LibrarySearchProps = Themed & {
    onSearch: Callback<string>,
    onClear?: Callback,
    state: SearchState,
};
function LibrarySearchComp({ state, onSearch }: LibrarySearchProps) {
    return <Column>
        <SearchBox
            onSearch={onSearch}
        />
        <SearchStateComp {...state} />
    </Column>;
}

function SearchStateComp(state: SearchState) {
    switch (state.state) {
        case 'error':
            return <span>Search error</span>;
        case 'loading':
            return <ActivityIndicator />;
        case 'ready':
            return <BookListComp
                books={state.results.map(r => r.desc)}
            />;
        case 'empty':
        default:
            return null;
    }
}
