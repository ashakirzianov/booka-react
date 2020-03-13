import React from 'react';

export function SearchBox({ initial, onSearch }: {
    placeholder?: string,
    initial?: string,
    onSearch: (query: string) => void,
}) {
    return <input
        defaultValue={initial}
        type='text'
        onChange={event => {
            onSearch(event.target.value);
        }}
    />;
}
