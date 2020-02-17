import React from 'react';
import { Callback, LibraryCard } from 'booka-common';
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
    const openBook = React.useCallback((card: LibraryCard) => dispatch({
        type: 'book-open',
        payload: {
            bookId: card.id,
        },
    }), [dispatch]);

    const theme = useTheme();

    return <LibrarySearchComp
        theme={theme}
        onSearch={querySearch}
        onClear={clearSearch}
        onSelectBook={openBook}
        state={searchState}
    />;
}

function LibrarySearchComp({ state, onSearch, onSelectBook }: Themed & {
    onSearch: Callback<string>,
    onSelectBook: Callback<LibraryCard>,
    onClear?: Callback,
    state: SearchState,
}) {
    return <Column>
        <SearchBox
            onSearch={onSearch}
        />
        <SearchStateComp
            state={state}
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
