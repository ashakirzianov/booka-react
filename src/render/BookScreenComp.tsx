import React from 'react';
import {
    assertNever, BookRange, positionForPath, BookPath,
} from 'booka-common';

import { BookState } from '../ducks';
import { useAppDispatch } from '../core';
import { BookViewComp } from './BookViewComp';
import {
    WithChildren, Column, point, Row, Callback, Themed,
    Triad, IconButton, TopBar, EmptyLine, Clickable,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
    colors, TextLine, BottomBar, TagButton,
} from '../atoms';

export type BookScreenProps = Themed & {
    screen: BookState,
    setQuoteRange: Callback<BookRange | undefined>,
    updateCurrentPath: Callback<BookPath>,
    toggleControls: Callback,
    controlsVisible: boolean,
};
export function BookScreenComp(props: BookScreenProps) {
    return <BookScreenContainer {...props} >
        <BookScreenContent {...props} />
    </BookScreenContainer>;
}

function BookScreenContent({
    screen, setQuoteRange, theme, updateCurrentPath,
}: BookScreenProps) {
    switch (screen.state) {
        case 'empty':
            return <span>No fragment set</span>;
        case 'loading':
            return <span>loading: {screen.id}</span>;
        case 'ready':
            return <BookViewComp
                bookId={screen.id}
                theme={theme}
                fragment={screen.fragment}
                pathToScroll={
                    screen.needToScroll
                        ? screen.path
                        : null
                }
                updateBookPosition={updateCurrentPath}
                quoteRange={screen.quote}
                setQuoteRange={setQuoteRange}
            />;
        case 'error':
            return <span>error: {screen.id}</span>;
        default:
            assertNever(screen);
            return <span>Should not happen</span>;
    }
}

type BookScreenContainerProps = WithChildren<BookScreenProps>;
function BookScreenContainer({
    theme, controlsVisible, toggleControls, children,
    screen,
}: BookScreenContainerProps) {
    return <>
        <BookScreenHeader
            theme={theme}
            visible={controlsVisible}
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
            screen={screen}
            visible={controlsVisible}
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

type TocButtonProps = Themed & {
    current: number,
    total: number | undefined,
};
function TocButton(props: TocButtonProps) {
    return <TagButton
        theme={props.theme}
        text={
            props.total !== undefined
                ? `${props.current} of ${props.total}`
                : `${props.current}`
        }
    />;
}

type BookScreenFooterProps = Themed & {
    screen: BookState,
    visible: boolean,
};
function BookScreenFooter({
    screen, theme, visible,
}: BookScreenFooterProps) {
    if (screen.state === 'ready') {
        const fragment = screen.fragment;
        const path = screen.path;
        const total = fragment.toc
            ? pageForPosition(fragment.toc.length)
            : undefined;
        const currentPage = pageForPosition(positionForPath(fragment, path));
        const nextChapterPage = fragment.next
            ? pageForPosition(fragment.next.position)
            : total;
        return <BottomBar theme={theme} open={visible}>
            <Triad
                center={
                    <TocButton
                        theme={theme}
                        current={currentPage}
                        total={total}
                    />
                }
                right={<TextLine
                    theme={theme}
                    text={
                        nextChapterPage !== undefined
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
