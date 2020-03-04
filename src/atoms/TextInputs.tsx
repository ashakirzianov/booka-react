import React from 'react';
import { Callback } from 'booka-common';

export type SearchBoxProps = {
    placeholder?: string,
    onSearch: Callback<string>,
    onClear: Callback,
};
export function SearchBox({ onSearch, onClear }: SearchBoxProps) {
    return <input
        type='text'
        onChange={event => {
            if (event.target.value) {
                onSearch(event.target.value);
            } else {
                onClear();
            }
        }}
    />;
}
