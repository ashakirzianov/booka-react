import React from 'react';

import { useTheme, PaletteName, Themed } from '../application';
import {
    Column, point, Row, IconButton,
    PaletteButton, TextButton, Separator, WithPopover,
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
    setPalette: (name: PaletteName) => void,
    incrementScale: (inc: number) => void,
}) {
    return <Column width={point(14)}>
        <FontScale theme={theme} incrementScale={incrementScale} />
        <Separator />
        <PalettePicker theme={theme} setPalette={setPalette} />
    </Column>;
}

function FontScale({ theme, incrementScale }: Themed & {
    incrementScale: (inc: number) => void,
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
    incrementScale: (inc: number) => void,
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
    setPalette: (name: PaletteName) => void,
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
    setPalette: (name: PaletteName) => void,
}) {
    return <PaletteButton
        theme={theme}
        text={text}
        palette={name}
        onClick={() => setPalette(name)}
    />;
}
