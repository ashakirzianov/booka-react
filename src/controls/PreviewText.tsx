// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from './theme';
import { actionShadow, doublePadding, fontCss } from './common';

export function PreviewText({ text, lines, theme }: Themed & {
    text: string,
    lines: number,
}) {
    return <div css={{
        padding: doublePadding,
        boxShadow: actionShadow(colors(theme).shadow),
        color: colors(theme).text,
        backgroundColor: colors(theme).primary,
        margin: 0,
        minHeight: 0,
        maxHeight: '100%',
        textIndent: doublePadding,
        cursor: 'pointer',
        '&:hover': {
            boxShadow: actionShadow(colors(theme).highlight),
        },
    }}>
        <p css={{
            // TODO: rethink this ?
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'justify',
            minHeight: 0,
            maxHeight: '100%',
            color: colors(theme).text,
            ...fontCss({
                theme,
                fontFamily: 'book',
                fontSize: 'small',
            }),
            margin: 0,
            textIndent: doublePadding,
        }}>
            {text}
        </p>
    </div>;
}
