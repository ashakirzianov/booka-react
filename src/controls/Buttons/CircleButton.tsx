/** @jsx jsx */
import { jsx } from '@emotion/core';
import { View } from 'react-native';
import { roundShadow } from '../common';
import { colors, getFontSize, PaletteColor, Themed } from '../theme';

export function CircleButton({
    theme, onClick, selected, text, background,
}: Themed & {
    text?: string,
    background: PaletteColor,
    selected: boolean,
    onClick: () => void,
}) {
    return <div
        onClick={onClick}
        css={{
            display: 'flex',
            color: colors(theme).text,
            fontSize: getFontSize(theme, 'normal'),
            '&:hover': {
                color: colors(theme).highlight,
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
            borderColor: selected ? colors(theme).highlight : 'rgba(0,0,0,0)',
            borderStyle: 'solid',
            boxShadow: roundShadow(colors(theme).shadow),
            '&:hover': {
                borderColor: colors(theme).highlight,
                boxShadow: roundShadow(colors(theme).highlight),
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
