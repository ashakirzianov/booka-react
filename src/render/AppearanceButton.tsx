import React from 'react';

import { useTheme } from '../application';
import {
    WithPopover, View, IconButton, PaletteButton,
    TextButton, Separator, point, doubleMargin,
} from '../controls';
import { PaletteName, Themed } from '../core';

export function AppearanceButton() {
    const { theme, incrementScale, setPalette } = useTheme();
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
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
        margin: doubleMargin,
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
            theme={theme} increment={-0.1} size='micro' incrementScale={incrementScale} />
        <FontScaleButton
            theme={theme} increment={0.1} size='macro' incrementScale={incrementScale} />
    </View>;
}

function FontScaleButton({
    theme, size, increment, incrementScale,
}: Themed & {
    size: 'macro' | 'micro',
    increment: number,
    incrementScale: (inc: number) => void,
}) {
    return <View>
        <TextButton
            theme={theme}
            fontFamily='book'
            text='Abc'
            fontSize={size}
            onClick={() => incrementScale(increment)}
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
    return <PaletteButton
        theme={theme}
        text={text}
        palette={name}
        onClick={() => setPalette(name)}
    />;
}
