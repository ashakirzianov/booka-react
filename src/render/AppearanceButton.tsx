import React from 'react';

import { useTheme } from '../application';
import {
    Column, point, Row, Callback, Themed, IconButton,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
} from '../atoms';

export function AppearanceButton() {
    const { theme, incrementScale, setPalette } = useTheme();
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={
            <ThemePicker
                theme={theme}
                setPalette={setPalette}
                incrementScale={incrementScale}
            />
        }
    >
        <IconButton theme={theme} icon='letter' />
    </WithPopover>;
}

function ThemePicker({ theme, setPalette, incrementScale }: Themed & {
    setPalette: Callback<PaletteName>,
    incrementScale: Callback<number>,
}) {
    return <Column width={point(14)}>
        <FontScale theme={theme} incrementScale={incrementScale} />
        <Separator />
        <PalettePicker theme={theme} setPalette={setPalette} />
    </Column>;
}

function FontScale({ theme, incrementScale }: Themed & {
    incrementScale: Callback<number>,
}) {
    return <Row centered justified height={point(5)}>
        <FontScaleButton
            theme={theme} increment={-0.1} size='smallest' incrementScale={incrementScale} />
        <FontScaleButton
            theme={theme} increment={0.1} size='largest' incrementScale={incrementScale} />
    </Row>;
}

function FontScaleButton({
    theme, size, increment, incrementScale,
}: Themed & {
    size: 'largest' | 'smallest',
    increment: number,
    incrementScale: Callback<number>,
}) {
    return <Column centered>
        <TextButton
            theme={theme}
            fontFamily='book'
            text='Abc'
            fontSize={size}
            onClick={() => incrementScale(increment)}
        />
    </Column>;
}

function PalettePicker({ theme, setPalette }: Themed & {
    setPalette: Callback<PaletteName>,
}) {
    return <Row centered justified height={point(5)}>
        <SelectPaletteButton
            theme={theme} name='light' text='L' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='sepia' text='S' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='dark' text='D' setPalette={setPalette} />
    </Row>;
}

function SelectPaletteButton({ theme, text, name, setPalette }: Themed & {
    text: string,
    name: PaletteName,
    setPalette: Callback<PaletteName>,
}) {
    return <PaletteButton
        theme={theme}
        text={text}
        palette={name}
        onClick={() => setPalette(name)}
    />;
}
