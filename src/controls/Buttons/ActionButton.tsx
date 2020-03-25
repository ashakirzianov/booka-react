/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily, PaletteColor } from '../theme';
import { actionShadow, buttonHeight, buttonWidth, normalMargin, buttonStyle } from '../common';
import { View } from 'react-native';

export function ActionButton({
    text, callback, color, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    callback?: () => void,
}) {
    const textColor = colors(theme)[color ?? 'accent'];
    const fore = colors(theme)[color ?? 'accent'];
    const back = colors(theme).primary;
    const highlight = colors(theme).highlight;
    return <View style={{
        margin: normalMargin,
    }}>
        <button
            onClick={callback}
            css={{
                ...buttonStyle,
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
        >
            {text}
        </button>
    </View>;
}
