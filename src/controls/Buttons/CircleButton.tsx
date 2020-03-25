/** @jsx jsx */
import { jsx } from '@emotion/core';
import { View } from 'react-native';
import { roundShadow, normalMargin } from '../common';
import { colors, getFontSize, PaletteColor, Themed, FontSizes } from '../theme';

export function CircleButton({
    theme, onClick, text,
    color, background, highlight, border, shadow,
    fontSize, size,
}: Themed & {
    text?: string,
    color: PaletteColor,
    background: PaletteColor,
    highlight: PaletteColor,
    border?: PaletteColor,
    shadow?: PaletteColor,
    fontSize: keyof FontSizes,
    size: number,
    onClick: () => void,
}) {
    return <div
        onClick={onClick}
        css={{
            display: 'flex',
            margin: normalMargin,
            color: colors(theme)[color],
            fontSize: getFontSize(theme, fontSize),
            '&:hover': {
                color: colors(theme)[highlight],
            },
        }}
    >
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            width: size,
            height: size,
            justifyContent: 'center',
            backgroundColor: colors(theme)[background],
            borderRadius: size,
            borderWidth: 3,
            borderColor: border
                ? colors(theme)[border]
                : 'rgba(0,0,0,0)',
            borderStyle: 'solid',
            boxShadow: shadow
                ? roundShadow(colors(theme)[shadow])
                : undefined,
            '&:hover': {
                borderColor: colors(theme)[highlight],
                boxShadow: shadow
                    ? roundShadow(colors(theme)[highlight])
                    : undefined,
            },
        }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <span>{text}</span>
            </View>
        </div>
    </div>;
}
