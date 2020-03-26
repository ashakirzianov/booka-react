import React from 'react';
import {
    Themed, getFontSize, colors, PaletteColor, FontSizes,
} from './theme';
import { regularFontWeight, boldFontWeight } from './common';

export function Label({
    text, color, size, italic, bold, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    size?: keyof FontSizes,
    italic?: boolean,
    bold?: boolean,
}) {
    return <span style={{
        color: colors(theme)[color ?? 'text'],
        fontSize: getFontSize(theme, size ?? 'normal'),
        fontFamily: theme.fontFamilies.menu,
        fontStyle: italic ? 'italic' : undefined,
        fontWeight: bold
            ? boldFontWeight
            : regularFontWeight,
    }}>
        {text}
    </span>;
}
