import React from 'react';
import {
    Themed, getFontSize, colors, PaletteColor, FontSizes,
} from './theme';

export function Label({
    text, color, size, italic, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    size?: keyof FontSizes,
    italic?: boolean,
}) {
    return <span style={{
        color: colors(theme)[color ?? 'text'],
        fontSize: getFontSize(theme, size ?? 'small'),
        fontFamily: theme.fontFamilies.menu,
        fontStyle: italic ? 'italic' : undefined,
    }}>
        {text}
    </span>;
}
