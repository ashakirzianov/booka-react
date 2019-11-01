import React from 'react';
import {
    assertNever, BookRange, positionForPath, BookPath,
} from 'booka-common';

import { BookState } from '../ducks';
import { useAppDispatch } from '../core';
import {
    WithChildren, Column, point, Row, Callback, Themed,
    Triad, IconButton, TopBar, EmptyLine, Clickable,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
    colors, TextLine, BottomBar, TagButton,
} from '../atoms';
import { pageForPosition } from './common';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp } from './TableOfContentsComp';

export type BookScreenProps = Themed & {
    screen: BookState,
    controlsVisible: boolean,
    setQuoteRange: Callback<BookRange | undefined>,
    updateCurrentPath: Callback<BookPath>,
    toggleControls: Callback,
    toggleToc: Callback,
};
export function BookScreenComp(props: BookScreenProps) {
    return <BookScreenContainer {...props} >
        <BookScreenContent {...props} />
    </BookScreenContainer>;
}

function BookScreenContent({
    screen, setQuoteRange, theme,
    updateCurrentPath, toggleToc,
}: BookScreenProps) {
    switch (screen.state) {
        case 'loading':
            return <span>loading: {screen.link.bookId}</span>;
        case 'ready':
            return <>
                <BookViewComp
                    bookId={screen.link.bookId}
                    theme={theme}
                    fragment={screen.fragment}
                    pathToScroll={
                        screen.needToScroll
                            ? screen.link.path
                            : undefined
                    }
                    updateBookPosition={updateCurrentPath}
                    quoteRange={screen.link.quote}
                    setQuoteRange={setQuoteRange}
                />
                {
                    screen.showToc && screen.fragment.toc
                        ? <TableOfContentsComp
                            theme={theme}
                            toc={screen.fragment.toc}
                            id={screen.link.bookId}
                            toggleToc={toggleToc}
                        />
                        : null
                }
            </>;
        case 'error':
            return <span>error: {screen.link.bookId}</span>;
        default:
            assertNever(screen);
            return <span>Should not happen</span>;
    }
}

type BookScreenContainerProps = WithChildren<BookScreenProps>;
function BookScreenContainer(props: BookScreenContainerProps) {
    return <>
        <BookScreenHeader
            theme={props.theme}
            visible={props.controlsVisible}
        />
        <BookScreenFooter {...props} />
        <Row fullWidth centered
            backgroundColor={colors(props.theme).primary}
        >
            <Clickable onClick={props.toggleControls}>
                <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
                    <EmptyLine />
                    {props.children}
                    <EmptyLine />
                </Column>
            </Clickable>
        </Row>
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
    toggleToc: Callback,
};
function TocButton({ theme, total, current, toggleToc }: TocButtonProps) {
    return <TagButton
        theme={theme}
        text={
            total !== undefined
                ? `${current} of ${total}`
                : `${current}`
        }
        onClick={toggleToc}
    />;
}

type BookScreenFooterProps = BookScreenProps;
function BookScreenFooter({
    screen, theme, controlsVisible, toggleToc,
}: BookScreenFooterProps) {
    if (screen.state === 'ready') {
        const fragment = screen.fragment;
        const path = screen.link.path || fragment.current.path;
        const total = fragment.toc
            ? pageForPosition(fragment.toc.length)
            : undefined;
        const currentPage = pageForPosition(positionForPath(fragment, path));
        const nextChapterPage = fragment.next
            ? pageForPosition(fragment.next.position)
            : total;
        return <BottomBar theme={theme} open={controlsVisible}>
            <Triad
                center={
                    <TocButton
                        theme={theme}
                        current={currentPage}
                        total={total}
                        toggleToc={toggleToc}
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
