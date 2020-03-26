// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from '../theme';
import { halfPadding, buttonHeight, buttonStyle, fontCss } from '../common';

export function BorderButton({
    text, theme, callback,
}: Themed & {
    text: string,
    callback?: () => void,
}) {
    return <button
        css={{
            ...buttonStyle,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textDecoration: 'none',
            color: colors(theme).accent,
            ...fontCss({ theme, fontFamily: 'book' }),
            border: `3px solid ${colors(theme).accent}`,
            height: buttonHeight,
            paddingLeft: halfPadding, paddingRight: halfPadding,
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
        onClick={callback}
    >
        {text}
    </button>;
}
