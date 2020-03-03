import React from 'react';
import { Callback, LibraryCard } from 'booka-common';
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
    const openBook = React.useCallback((card: LibraryCard) => dispatch({
        type: 'card-show',
        payload: card,
    }), [dispatch]);

    const theme = useTheme();

    return <LibrarySearchComp
        theme={theme}
        onSearch={querySearch}
        onClear={clearSearch}
        onSelectBook={openBook}
        searchState={searchState}
    />;
}

function LibrarySearchComp({ searchState, onSearch, onSelectBook, }: Themed & {
    onSearch: Callback<string>,
    onSelectBook: Callback<LibraryCard>,
    onClear?: Callback,
    searchState: SearchState,
}) {
    return <Column>
        <LibraryCardConnected />
        <SearchBox
            onSearch={onSearch}
        />
        <SearchStateComp
            state={searchState}
            onSelectBook={onSelectBook}
        />
    </Column>;
}

function SearchStateComp({ state, onSelectBook }: {
    state: SearchState,
    onSelectBook: Callback<LibraryCard>,
}) {
    switch (state.state) {
        case 'error':
            return <span>Search error</span>;
        case 'loading':
            return <ActivityIndicator />;
        case 'ready':
            return <BookListComp
                books={state.results.map(r => r.desc)}
                onClick={onSelectBook}
            />;
        case 'empty':
        default:
            return null;
    }
}
