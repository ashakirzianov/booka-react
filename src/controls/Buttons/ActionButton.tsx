/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, PaletteColor } from '../theme';
import {
    buttonHeight, buttonWidth, normalMargin, buttonStyle,
    fontCss, actionCss, actionHoverCss,
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
                ...fontCss({ theme, fontSize: 'small' }),
                color: colors(theme).primary,
                borderColor: colors(theme)[color],
                ...actionCss({ theme }),
                backgroundColor: colors(theme)[color],
                '&:hover': {
                    ...actionHoverCss({ theme }),
                },
            }}
        >
            {text}
        </button>
    </View>;
}
