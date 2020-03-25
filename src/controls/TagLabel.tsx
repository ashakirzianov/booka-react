/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontSize, getFontFamily, PaletteColor,
} from './theme';
import { normalPadding, nanoMargin } from './common';

export function TagLabel({
    text, theme, color,
}: Themed & {
    text: string,
    color?: PaletteColor,
}) {
    const actualColor = colors(theme)[color ?? 'accent'];
    const fontSize = getFontSize(theme, 'nano');
    return <div css={{
        margin: nanoMargin,
        paddingLeft: normalPadding, paddingRight: normalPadding,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: fontSize,
        fontSize,
        fontFamily: getFontFamily(theme, 'menu'),
        borderColor: actualColor,
        color: actualColor,
    }}
    >
        {text}
    </div>;
}
