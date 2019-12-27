import React from 'react';
import { Callback } from 'booka-common';

export type SearchBoxProps = {
    placeholder?: string,
    onSearch: Callback<string>,
    onClear?: Callback,
};
export function SearchBox({ onSearch }: SearchBoxProps) {
    return <input
        type='text'
        onChange={event => {
            onSearch(event.target.value);
        }}
    />;
}
