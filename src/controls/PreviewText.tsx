import React from 'react';
import { Themed, getFontFamily, getFontSize, colors } from '../application';

export function PreviewText({ text, lines, theme }: Themed & {
    text: string,
    lines: number,
}) {
    return <p style={{
        // TODO: rethink this ?
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'break-spaces',

        // textAlign: 'center',
        minHeight: 0,
        maxHeight: '100%',
        color: colors(theme).text,
        fontSize: getFontSize(theme, 'small'),
        fontFamily: getFontFamily(theme, 'book'),
        margin: 0,
    }}>
        {text}
    </p>;
}
