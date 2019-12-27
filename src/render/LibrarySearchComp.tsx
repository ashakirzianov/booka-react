import React from 'react';
import { Callback } from 'booka-common';
import { SearchState } from '../ducks';
import {
    Column, SearchBox, BookListComp, ActivityIndicator,
} from '../atoms';

export type LibrarySearchProps = {
    onSearch: Callback<string>,
    onClear?: Callback,
    state: SearchState,
};
export function LibrarySearchComp({ state, onSearch }: LibrarySearchProps) {
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
