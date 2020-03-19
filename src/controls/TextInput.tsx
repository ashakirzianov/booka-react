import React from 'react';
import { Themed } from '../application';

export function TextInput({ initial, onChange }: Themed & {
    placeholder?: string,
    initial?: string,
    onChange: (text: string) => void,
}) {
    return <input
        defaultValue={initial}
        type='text'
        onChange={event => {
            onChange(event.target.value);
        }}
    />;
}
