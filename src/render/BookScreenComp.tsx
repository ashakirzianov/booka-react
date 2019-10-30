import React from 'react';
import {
    assertNever, BookRange, positionForPath,
} from 'booka-common';

import { AppState } from '../ducks';
import { updateCurrentPath, useAppDispatch } from '../core';
import { BookViewComp } from './BookViewComp';
import {
    WithChildren, Column, point, Row, Callback, Themed,
    Triad, IconButton, TopBar, EmptyLine, Clickable,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
    colors, TextLine, BottomBar,
} from '../atoms';

export type BookScreenProps = Themed & {
    fragment: AppState['currentFragment'],
    setQuoteRange: Callback<BookRange | undefined>,
    toggleControls: Callback,
    controlsVisible: boolean,
};
export function BookScreenComp(props: BookScreenProps) {
    return <BookScreenContainer
        theme={props.theme}
        fragment={props.fragment}
        visible={props.controlsVisible}
        toggleControls={props.toggleControls}
    >
        <BookScreenContent {...props} />
    </BookScreenContainer>;
}

function BookScreenContent({
    fragment, setQuoteRange, theme,
}: BookScreenProps) {
    switch (fragment.state) {
        case 'no-fragment':
            return <span>No fragment set</span>;
        case 'loading':
            return <span>loading: {fragment.location.id}</span>;
        case 'ready':
            return <BookViewComp
                bookId={fragment.location.id}
                theme={theme}
                fragment={fragment.fragment}
                pathToScroll={fragment.location.path}
                // TODO: abstract updateCurrentPath ?
                updateBookPosition={updateCurrentPath}
                quoteRange={fragment.quote}
                setQuoteRange={setQuoteRange}
            />;
        case 'error':
            return <span>error: {fragment.location.id}</span>;
        default:
            assertNever(fragment);
            return <span>Should not happen</span>;
    }
}

type BookScreenContainerProps = WithChildren<Themed & {
    visible: boolean,
    toggleControls: Callback,
    fragment: AppState['currentFragment'],
}>;
function BookScreenContainer({
    theme, visible, toggleControls, children,
    fragment,
}: BookScreenContainerProps) {
    return <>
        <BookScreenHeader
            theme={theme}
            visible={visible}
        />
        <Row fullWidth centered
            backgroundColor={colors(theme).primary}
        >
            <Clickable onClick={toggleControls}>
                <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
                    <EmptyLine />
                    {children}
                    <EmptyLine />
                </Column>
            </Clickable>
        </Row>
        <BookScreenFooter
            theme={theme}
            fragment={fragment}
            visible={visible}
        />
    </>;
}

type BookScreenHeaderProps = Themed & {
    visible: boolean,
};
function BookScreenHeader({ theme, visible }: BookScreenHeaderProps) {
    return <TopBar
        theme={theme}
        open={visible}
        paddingHorizontal={point(1)}
    >
        <Triad
            left={<LibButton theme={theme} />}
            right={<AppearanceButton theme={theme} />}
        />
    </TopBar>;
}

type LibButtonProps = Themed;
function LibButton({ theme }: LibButtonProps) {
    return <IconButton
        theme={theme}
        icon='left'
        to='/'
    />;
}

type AppearanceButtonProps = Themed;
function AppearanceButton({ theme }: AppearanceButtonProps) {
    const dispatch = useAppDispatch();
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={
            <ThemePicker
                theme={theme}
                setPalette={name => dispatch({
                    type: 'theme-set-palette',
                    payload: name,
                })}
                incrementScale={increment => dispatch({
                    type: 'theme-increment-scale',
                    payload: increment,
                })}
            />
        }
    >
        <IconButton theme={theme} icon='letter' />
    </WithPopover>;
}

type ThemePickerProps = Themed & {
    setPalette: Callback<PaletteName>,
    incrementScale: Callback<number>,
};
function ThemePicker({ theme, setPalette, incrementScale }: ThemePickerProps) {
    return <Column width={point(14)}>
        <FontScale theme={theme} incrementScale={incrementScale} />
        <Separator />
        <PalettePicker theme={theme} setPalette={setPalette} />
    </Column>;
}

type FontScaleProps = Themed & {
    incrementScale: Callback<number>,
};
function FontScale({ theme, incrementScale }: FontScaleProps) {
    return <Row centered justified height={point(5)}>
        <FontScaleButton
            theme={theme} increment={-0.1} size='smallest' incrementScale={incrementScale} />
        <FontScaleButton
            theme={theme} increment={0.1} size='largest' incrementScale={incrementScale} />
    </Row>;
}

type FontScaleButtonProps = Themed & {
    size: 'largest' | 'smallest',
    increment: number,
    incrementScale: Callback<number>,
};
function FontScaleButton({
    theme, size, increment, incrementScale,
}: FontScaleButtonProps) {
    return <Column centered>
        <TextButton
            theme={theme}
            fontFamily='book'
            text='Abc'
            fontSize={size}
            color='accent'
            onClick={() => incrementScale(increment)}
        />
    </Column>;
}

type PalettePickerProps = Themed & {
    setPalette: Callback<PaletteName>,
};
function PalettePicker({ theme, setPalette }: PalettePickerProps) {
    return <Row centered justified height={point(5)}>
        <SelectPaletteButton
            theme={theme} name='light' text='L' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='sepia' text='S' setPalette={setPalette} />
        <SelectPaletteButton
            theme={theme} name='dark' text='D' setPalette={setPalette} />
    </Row>;
}

type PaletteButtonProps = Themed & {
    text: string,
    name: PaletteName,
    setPalette: Callback<PaletteName>,
};
function SelectPaletteButton({ theme, text, name, setPalette }: PaletteButtonProps) {
    return <PaletteButton
        theme={theme}
        text={text}
        palette={name}
        onClick={() => setPalette(name)}
    />;
}

type BookScreenFooterProps = Themed & {
    fragment: AppState['currentFragment'],
    visible: boolean,
};
function BookScreenFooter({
    fragment: fragmentState, theme, visible,
}: BookScreenFooterProps) {
    if (fragmentState.state === 'ready') {
        const fragment = fragmentState.fragment;
        const path = fragmentState.location.path;
        // const total: number | undefined = undefined; // TODO: implement
        const currentPage = fragment
            ? pageForPosition(positionForPath(fragment, path))
            : undefined;
        const nextChapterPage = fragment && fragment.next
            ? pageForPosition(fragment.next.position)
            : undefined;
        return <BottomBar theme={theme} open={visible}>
            <Triad
                // TODO: add ToC
                // center={
                //     <TocButton
                //         theme={theme}
                //         current={currentPage}
                //         total={total}
                //     />
                // }
                right={<TextLine
                    theme={theme}
                    text={
                        nextChapterPage !== undefined && currentPage !== undefined
                            ? `${nextChapterPage - currentPage} pages left`
                            : ''
                    }
                    fontSize='smallest'
                    color='accent'
                />}
            />
        </BottomBar>;
    } else {
        return null;
    }

}

function pageForPosition(position: number): number {
    return Math.floor(position / 1500) + 1;
}
