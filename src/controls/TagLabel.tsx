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
    return <div
        onClick={onClick}
        css={{
            borderStyle: 'solid',
            borderWidth: 2,
            borderRadius: '50%',
            fontSize: getFontSize(theme, 'smallest'),
            fontFamily: getFontFamily(theme, 'menu'),
            borderColor: actualColor,
            color: actualColor,
        }}
    >
        {text}
    </div>;
}
