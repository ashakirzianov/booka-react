// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontFamily, getFontSize } from '../theme';
import { halfPadding } from '../common';

export function BorderButton({
    text, theme, onClick,
}: Themed & {
    text: string,
    onClick?: () => void,
}) {
    return <div
        css={{
            textDecoration: 'none',
            color: colors(theme).accent,
            fontFamily: getFontFamily(theme, 'menu'),
            fontSize: getFontSize(theme, 'normal'),
            borderStyle: 'solid',
            // borderRadius: 10,
            padding: halfPadding,
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
        onClick={onClick}
    >
        {text}
    </div>;
}
