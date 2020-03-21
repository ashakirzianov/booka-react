// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, getFontSize, colors } from '../application';
import { actionShadow, buttonHeight } from './common';

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
            padding: 0,
            height: buttonHeight,
            color: colors(theme).text,
            fontSize: getFontSize(theme, 'largest'),
            boxShadow: actionShadow(colors(theme).shadow),
            '&::placeholder': {
                color: colors(theme).accent,
                fontSize: getFontSize(theme, 'normal'),
                fontStyle: 'italic',
                fontWeight: 100,
            },
            '&:focus::placeholder': {
                color: colors(theme).highlight,
            },
            '&:focus': {
                outline: 'none',
                color: colors(theme).highlight,
                boxShadow: actionShadow(colors(theme).highlight),
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
