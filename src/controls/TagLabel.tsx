/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontSize, getFontFamily, PaletteColor,
} from './theme';
import { normalPadding, xxsmallMargin, regularFontWeight } from './common';

export function TagLabel({
    text, theme, color,
}: Themed & {
    text: string,
    color?: PaletteColor,
}) {
    const actualColor = colors(theme)[color ?? 'accent'];
    return <div css={{
        margin: xxsmallMargin,
        paddingLeft: normalPadding, paddingRight: normalPadding,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: getFontSize(theme, 'xsmall'),
        fontSize: getFontSize(theme, 'xsmall'),
        fontFamily: getFontFamily(theme, 'menu'),
        fontWeight: regularFontWeight,
        borderColor: actualColor,
        color: actualColor,
    }}
    >
        {text}
    </div>;
}
