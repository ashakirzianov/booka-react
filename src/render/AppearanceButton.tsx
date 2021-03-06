import React from 'react';

import { useTheme, useIncrementScale, useSetPalette } from '../application';
import {
    WithPopover, View, IconButton,
    TextButton, Separator, point, doubleSpace, CircleButton,
} from '../controls';
import { PaletteName, Themed, FontSizes } from '../core';

export function AppearanceButton() {
    const theme = useTheme();
    const incrementScale = useIncrementScale();
    const setPalette = useSetPalette();
    return <WithPopover
        theme={theme}
        placement='bottom'
        body={<ThemePicker
            theme={theme}
            setPalette={setPalette}
            incrementScale={incrementScale}
        />}
    >
        <IconButton theme={theme} icon='letter' />
    </WithPopover>;
}

function ThemePicker({ theme, setPalette, incrementScale }: Themed & {
    setPalette: (name: PaletteName) => void,
    incrementScale: (inc: number) => void,
}) {
    return <View style={{
        width: point(14),
        margin: doubleSpace,
    }}>
        <FontScale theme={theme} incrementScale={incrementScale} />
        <Separator />
        <PalettePicker theme={theme} setPalette={setPalette} />
    </View>;
}

function FontScale({ theme, incrementScale }: Themed & {
    incrementScale: (inc: number) => void,
}) {
    return <View style={{
        height: point(6),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }}>
        <FontScaleButton
            theme={theme} increment={-0.1} size='small' incrementScale={incrementScale} />
        <FontScaleButton
            theme={theme} increment={0.1} size='xlarge' incrementScale={incrementScale} />
    </View>;
}

function FontScaleButton({
    theme, size, increment, incrementScale,
}: Themed & {
    size: keyof FontSizes,
    increment: number,
    incrementScale: (inc: number) => void,
}) {
    return <View>
        <TextButton
            theme={theme}
            fontFamily='book'
            text='Abc'
            fontSize={size}
            callback={() => incrementScale(increment)}
        />
    </View>;
}

function PalettePicker({ theme, setPalette }: Themed & {
    setPalette: (name: PaletteName) => void,
}) {
    return <View style={{
        height: point(6),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }}>
        <SelectPaletteButton
            theme={theme} name='light' text='L' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='sepia' text='S' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='dark' text='D' setPalette={setPalette} />
    </View>;
}

function SelectPaletteButton({ theme, text, name, setPalette }: Themed & {
    text: string,
    name: PaletteName,
    setPalette: (name: PaletteName) => void,
}) {
    const themeToUse = { ...theme, currentPalette: name };
    const selected = name === theme.currentPalette;
    return <CircleButton
        theme={themeToUse}
        text={text}
        color='text'
        background='primary'
        highlight='highlight'
        shadow='shadow'
        border={selected ? 'highlight' : undefined}
        fontSize='normal'
        size={50}
        callback={() => setPalette(name)}
    />;
}
