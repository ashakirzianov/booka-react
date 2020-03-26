/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily, PaletteColor } from '../theme';
import {
    actionShadow, buttonHeight, buttonWidth, normalMargin, buttonStyle,
} from '../common';
import { View } from 'react-native';

export function ActionButton({
    text, callback, color, theme,
}: Themed & {
    text: string,
    color?: PaletteColor,
    callback?: () => void,
}) {
    color = color ?? 'accent';
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
                // borderRadius: 3,
                fontSize: getFontSize(theme, 'small'),
                fontFamily: getFontFamily(theme, 'menu'),
                color: colors(theme).primary,
                borderColor: colors(theme)[color],
                boxShadow: actionShadow(colors(theme).shadow),
                backgroundColor: colors(theme)[color],
                '&:hover': {
                    borderColor: colors(theme).highlight,
                    background: colors(theme).highlight,
                    boxShadow: actionShadow(colors(theme).highlight),
                },
            }}
        >
            {text}
        </button>
    </View>;
}
