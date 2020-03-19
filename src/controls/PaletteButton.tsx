import React from 'react';
import { Themed, PaletteName, getFontSize } from '../application';
import { View } from 'react-native';

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
            boxShadow: `0px 0px 5px 0px ${cols.shadow}`,
            '&:hover': {
                borderColor: cols.highlight,
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
