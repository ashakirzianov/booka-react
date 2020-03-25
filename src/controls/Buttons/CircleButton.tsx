/** @jsx jsx */
import { jsx } from '@emotion/core';
import { View } from 'react-native';
import { roundShadow } from '../common';
import { colors, getFontSize, PaletteColor, Themed, FontSizes } from '../theme';

export function CircleButton({
    theme, onClick, text,
    color, background, highlight, border, shadow,
    fontSize,
}: Themed & {
    text?: string,
    color: PaletteColor,
    background: PaletteColor,
    highlight: PaletteColor,
    border?: PaletteColor,
    shadow?: PaletteColor,
    fontSize: keyof FontSizes,
    onClick: () => void,
}) {
    return <div
        onClick={onClick}
        css={{
            display: 'flex',
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
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: colors(theme)[background],
            borderRadius: 50,
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
