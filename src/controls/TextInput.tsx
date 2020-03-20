import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, getFontSize, colors, getShadow } from '../application';

export function TextInput({
    theme, initial, onChange, placeholder,
}: Themed & {
    placeholder?: string,
    initial?: string,
    onChange: (text: string) => void,
}) {
    return <input
        css={{
            flex: 1,
            borderWidth: 0,
            color: colors(theme).text,
            fontSize: getFontSize(theme, 'largest'),
            '&::placeholder': {
                color: colors(theme).accent,
                fontStyle: 'italic',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: getShadow(theme),
            },
        }}
        placeholder={placeholder}
        defaultValue={initial}
        type='text'
        onChange={event => {
            onChange(event.target.value);
        }}
    />;
}
