import React from 'react';
import { Callback } from 'booka-common';

export function SearchBox({ initial, onSearch, onClear }: {
    placeholder?: string,
    initial?: string,
    onSearch: Callback<string>,
    onClear?: Callback,
}) {
    return <input
        value={initial}
        type='text'
        onChange={event => {
            if (event.target.value) {
                onSearch(event.target.value);
            } else if (onClear) {
                onClear();
            }
        }}
    />;
}
