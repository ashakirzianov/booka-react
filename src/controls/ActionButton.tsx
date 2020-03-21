import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily } from '../application';
import { boxShadow } from './common';

export function ActionButton({
    text, onClick, theme,
}: Themed & {
    text: string,
    onClick?: () => void,
}) {
    return <input
        type='button'
        value={text}
        onClick={onClick}
        css={{
            cursor: 'pointer',
            borderStyle: 'solid',
            borderColor: colors(theme).accent,
            borderWidth: 2,
            fontSize: getFontSize(theme, 'small'),
            fontFamily: getFontFamily(theme, 'menu'),
            color: colors(theme).accent,
            padding: 10,
            boxShadow: boxShadow(colors(theme).shadow),
            '&:hover': {
                borderColor: colors(theme).highlight,
                color: colors(theme).highlight,
                boxShadow: boxShadow(colors(theme).highlight),
            },
        }}
    />;
}
