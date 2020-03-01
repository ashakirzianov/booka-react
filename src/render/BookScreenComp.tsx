import React from 'react';
import {
    assertNever, BookRange, positionForPath, BookPath,
    Highlight, firstPath, uuid,
} from 'booka-common';

import { BookState, BookReadyState } from '../ducks';
import { useAppDispatch, useAppSelector, useTheme } from '../core';
import {
    Column, point, Row, Callback, Themed,
    Triad, IconButton, TopBar, EmptyLine, Clickable,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
    colors, TextLine, BottomBar, TagButton, TextLink, IconLink,
} from '../atoms';
import { pageForPosition } from './common';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { ConnectedAccountButton } from './AccountButton';
import { FullScreenActivityIndicator } from '../atoms/Basics.native';

export function BookScreenConnected() {
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const controlsVisible = useAppSelector(s => s.book.showControls || false);
    const highlights = useAppSelector(s => s.highlights);
    const book = useAppSelector(s => s.book);

    const bookId = book.link.bookId;

    const setQuoteRange = React.useCallback((range: BookRange | undefined) => dispatch({
        type: 'book-set-quote',
        payload: range,
    }), [dispatch]);
    const updateCurrentPath = React.useCallback((path: BookPath) => dispatch({
        type: 'book-update-path',
        payload: path,
    }), [dispatch]);
    const toggleControls = React.useCallback(() => dispatch({
        type: 'book-toggle-controls',
    }), [dispatch]);
    const toggleToc = React.useCallback(() => dispatch({
        type: 'book-toggle-toc',
    }), [dispatch]);
    const openRef = React.useCallback((refId: string) => dispatch({
        type: 'book-open',
        payload: {
            link: 'book', bookId, refId,
        },
    }), [dispatch, bookId]);
    const addHighlight = React.useCallback((highlight: Highlight) => dispatch({
        type: 'highlights-add',
        payload: {
            highlight,
        },
    }), [dispatch]);

    return <BookScreenComp
        theme={theme}
        book={book}
        highlights={highlights}
        controlsVisible={controlsVisible}
        updateCurrentPath={updateCurrentPath}
        addHighlight={addHighlight}
        setQuoteRange={setQuoteRange}
        toggleControls={toggleControls}
        toggleToc={toggleToc}
        openRef={openRef}
    />;
}

type BookScreenPropsBase = Themed & {
    controlsVisible: boolean,
    addHighlight: Callback<Highlight>,
    openRef: Callback<string>,
    setQuoteRange: Callback<BookRange | undefined>,
    updateCurrentPath: Callback<BookPath>,
    toggleControls: Callback,
    toggleToc: Callback,
};

type BookScreenProps = BookScreenPropsBase & {
    book: BookState,
    highlights: Highlight[],
};
function BookScreenComp(props: BookScreenProps) {
    switch (props.book.state) {
        case 'loading':
            return <FullScreenActivityIndicator
                theme={props.theme}
            />;
        case 'ready':
            const readyProps = { ...props, book: props.book };
            return <BookScreenReadyComp {...readyProps} />;
        case 'error':
            return <Column>
                <TextLine
                    theme={props.theme}
                    text={`Error opening ${props.book.link.bookId}`}
                />
                <TextLink
                    theme={props.theme}
                    text='Back'
                    to='/'
                />
            </Column>;
        default:
            assertNever(props.book);
            return <span>Should not happen</span>;
    }
}

type BookScreenReadyProps = BookScreenPropsBase & {
    book: BookReadyState,
    highlights: Highlight[],
};
function BookScreenReadyComp(props: BookScreenReadyProps) {
    const pathToScroll = props.book.needToScroll
        ? props.book.link.path
        : undefined;
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
                    <BookViewComp
                        bookId={props.book.link.bookId}
                        theme={props.theme}
                        fragment={props.book.fragment}
                        pathToScroll={pathToScroll}
                        updateBookPosition={props.updateCurrentPath}
                        highlights={props.highlights}
                        addHighlight={props.addHighlight}
                        quoteRange={props.book.link.quote}
                        setQuoteRange={props.setQuoteRange}
                        openRef={props.openRef}
                    />
                    {
                        props.book.link.toc && props.book.fragment.toc
                            ? <TableOfContentsComp
                                theme={props.theme}
                                toc={props.book.fragment.toc}
                                id={props.book.link.bookId}
                                toggleToc={props.toggleToc}
                            />
                            : null
                    }
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
            right={
                <>
                    <AddBookmarkButton theme={theme} />
                    <AppearanceButton theme={theme} />
                    <ConnectedAccountButton
                    />
                </>}
        />
    </TopBar>;
}

function AddBookmarkButton({ theme }: Themed) {
    const dispatch = useAppDispatch();
    const currentLink = useAppSelector(state => state.book.link);
    return <TextButton
        theme={theme}
        text='Add Bookmark'
        fontSize='normal'
        fontFamily='menu'
        onClick={() => dispatch({
            type: 'bookmarks-add',
            payload: {
                bookmark: {
                    entity: 'bookmark',
                    _id: uuid(),
                    local: true,
                    bookId: currentLink.bookId,
                    path: currentLink.path || firstPath(),
                },
            },
        })}
    />;
}

type LibButtonProps = Themed;
function LibButton({ theme }: LibButtonProps) {
    return <IconLink
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

// TODO: decouple props
type BookScreenFooterProps = BookScreenProps;
function BookScreenFooter({
    book: screen, theme, controlsVisible, toggleToc,
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
