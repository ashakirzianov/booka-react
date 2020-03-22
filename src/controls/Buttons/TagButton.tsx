/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, getFontSize, getFontFamily, PaletteColor,
} from '../theme';

export function TagButton({
    text, onClick, theme, color,
}: Themed & {
    text: string,
    color?: PaletteColor,
    onClick?: () => void,
}) {
    return <input
        type='button'
        value={text}
        onClick={onClick}
        css={{
            cursor: 'pointer',
            borderStyle: 'solid',
            borderColor: colors(theme)[color ?? 'accent'],
            borderWidth: 2,
            borderRadius: '50%',
            fontSize: getFontSize(theme, 'smallest'),
            fontFamily: getFontFamily(theme, 'menu'),
            color: colors(theme).accent,
        }}
    />;
}
