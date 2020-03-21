import React from 'react';
import { Themed, getFontSize, colors } from '../application';

export function Label({
    text, theme,
}: Themed & {
    text: string,
}) {
    return <span style={{
        fontSize: getFontSize(theme, 'small'),
        fontFamily: theme.fontFamilies.menu,
        color: colors(theme).text,
    }}>
        {text}
    </span>;
}
