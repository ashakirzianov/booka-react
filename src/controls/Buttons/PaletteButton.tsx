/** @jsx jsx */
import { jsx } from '@emotion/core';
import { View } from 'react-native';
import { roundShadow } from '../common';
import { Themed, PaletteName, getFontSize } from '../theme';

// TODO: rethink location ?
export function PaletteButton(props: Themed & {
    text: string,
    palette: PaletteName,
    onClick: () => void,
}) {
    const theme = props.theme;
    const cols = theme.palettes[props.palette].colors;
    const selected = props.palette === theme.currentPalette;
    return <div
        onClick={props.onClick}
        css={{
            display: 'flex',
            color: cols.text,
            fontSize: getFontSize(props.theme, 'normal'),
            '&:hover': {
                color: cols.highlight,
            },
        }}
    >
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: cols.primary,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: selected ? cols.highlight : 'rgba(0,0,0,0)',
            borderStyle: 'solid',
            boxShadow: roundShadow(cols.shadow),
            '&:hover': {
                borderColor: cols.highlight,
                boxShadow: roundShadow(cols.highlight),
            },
        }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <span>{props.text}</span>
            </View>
        </div>
    </div>;
}
