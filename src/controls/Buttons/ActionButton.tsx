/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily, PaletteColor } from '../theme';
import { actionShadow, buttonHeight, buttonWidth, halfMargin } from '../common';

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
    const highlight = colors(theme).highlight;
    return <input
        type='button'
        value={text}
        onClick={onClick}
        css={{
            margin: halfMargin,
            width: buttonWidth,
            height: buttonHeight,
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
                borderColor: highlight,
                color: highlight,
                boxShadow: actionShadow(highlight),
            },
        }}
    />;
}
