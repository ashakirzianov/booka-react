import React from 'react';
import {
    Themed, colors, PaletteColor, FontSizes,
} from './theme';
import { fontCss, smallSpace } from './common';

export function Label({
    text, color, fontSize, italic, bold, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    fontSize?: keyof FontSizes,
    italic?: boolean,
    bold?: boolean,
}) {
    return <span style={{
        color: colors(theme)[color ?? 'text'],
        margin: smallSpace,
        ...fontCss({
            theme, fontSize, italic, bold,
        }),
    }}>
        {text}
    </span>;
}
