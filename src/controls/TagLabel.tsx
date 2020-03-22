/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontSize, getFontFamily, PaletteColor,
} from './theme';

export function TagLabel({
    text, onClick, theme, color,
}: Themed & {
    text: string,
    color?: PaletteColor,
    onClick?: () => void,
}) {
    const actualColor = colors(theme)[color ?? 'accent'];
    const fontSize = getFontSize(theme, 'smallest');
    return <div
        onClick={onClick}
        css={{
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
