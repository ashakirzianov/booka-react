/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily, PaletteColor } from '../theme';
import { actionShadow, point } from '../common';

export function ActionButton({
    text, onClick, color, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    onClick?: () => void,
}) {
    const textColor = colors(theme)[color ?? 'accent'];
    const fore = colors(theme)[color ?? 'accent'];
    const back = colors(theme).primary;
    return <input
        type='button'
        value={text}
        onClick={onClick}
        css={{
            width: point(8),
            padding: 10,
            cursor: 'pointer',
            borderStyle: 'solid',
            borderWidth: 2,
            fontSize: getFontSize(theme, 'small'),
            fontFamily: getFontFamily(theme, 'menu'),
            color: textColor,
            borderColor: fore,
            boxShadow: actionShadow(fore),
            backgroundColor: back,
            '&:hover': {
                borderColor: colors(theme).highlight,
                color: colors(theme).highlight,
                boxShadow: actionShadow(colors(theme).highlight),
            },
        }}
    />;
}
