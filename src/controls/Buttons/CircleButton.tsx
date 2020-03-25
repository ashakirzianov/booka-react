/** @jsx jsx */
import { jsx } from '@emotion/core';
import { View } from 'react-native';
import { roundShadow, buttonStyle } from '../common';
import { colors, getFontSize, PaletteColor, Themed, FontSizes } from '../theme';
import { getFontFamily } from '../../core';

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
    return <button
        style={buttonStyle}
        onClick={onClick}
    >
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: size,
            height: size,
            color: colors(theme)[color],
            fontSize: getFontSize(theme, fontSize),
            fontFamily: getFontFamily(theme, 'menu'),
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
                color: colors(theme)[highlight],
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
    </button>;
}
