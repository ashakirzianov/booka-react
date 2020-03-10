import React, { useState, useCallback, useMemo } from 'react';
import {
    assertNever, positionForPath, BookPath, firstPath, uuid,
    findBookmark, BookFragment,
} from 'booka-common';

import {
    useAppDispatch, useAppSelector, useTheme,
    useBookData, useHighlightsData,
} from '../application';
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
import { BookLink } from '../core';

export function BookScreen({
    bookId,
}: {
    // TODO: get from path ?
    bookId: string,
}) {
    const theme = useTheme();
    const link = useMemo((): BookLink => ({
        link: 'book',
        bookId,
    }), [bookId]);
    const state = useBookData(link);
    const { highlights } = useHighlightsData(bookId);

    const [visible, setVisible] = useState(true);
    const toggleControls = useCallback(
        () => setVisible(!visible),
        [visible, setVisible],
    );

    // TODO: implement
    const showToc: boolean = false;

    switch (state.state) {
        case 'loading':
            return <FullScreenActivityIndicator
                theme={theme}
            />;
        case 'ready': {
            const { fragment } = state;
            const { toc } = fragment;
            return <>
                <BookScreenHeader
                    theme={theme}
                    visible={visible}
                />
                <BookScreenFooter
                    theme={theme}
                    fragment={fragment}
                    visible={visible}
                    // TODO: implement
                    path={fragment.current.path}
                    toggleToc={() => undefined}
                />
                <Row fullWidth centered
                    backgroundColor={colors(theme).primary}
                >
                    <Clickable onClick={toggleControls}>
                        <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
                            <EmptyLine />
                            <BookViewComp
                                bookId={bookId}
                                theme={theme}
                                fragment={fragment}
                                highlights={highlights}
                                // TODO: implement
                                pathToScroll={undefined}
                                updateBookPosition={() => undefined}
                                quoteRange={undefined}
                                setQuoteRange={() => undefined}
                                openRef={() => undefined}
                            />
                            {
                                toc && showToc
                                    ? <TableOfContentsComp
                                        theme={theme}
                                        toc={toc}
                                        id={bookId}
                                        // TODO: implement
                                        toggleToc={() => undefined}
                                    />
                                    : null
                            }
                            <EmptyLine />
                        </Column>
                    </Clickable>
                </Row>
            </>;
        }

        case 'error':
            return <Column>
                <TextLine
                    theme={theme}
                    text={`Error opening ${bookId}`}
                />
                <TextLink
                    theme={theme}
                    text='Back'
                    to='/'
                />
            </Column>;
        default:
            assertNever(state);
            return <span>Should not happen</span>;
    }
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
                    <AddBookmarkButton />
                    <AppearanceButton theme={theme} />
                    <ConnectedAccountButton />
                </>}
        />
    </TopBar>;
}

function AddBookmarkButton() {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { bookId, path } = useAppSelector(state => state.book.link);
    const bookmarks = useAppSelector(state => state.bookmarks);

    const currentBookmark = path
        ? findBookmark(bookmarks, bookId, path) : undefined;
    if (currentBookmark) {
        return <TextButton
            theme={theme}
            text='Remove Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => dispatch({
                type: 'bookmarks-remove',
                payload: {
                    bookmarkId: currentBookmark._id,
                },
            })}
        />;
    } else {
        return <TextButton
            theme={theme}
            text='Add Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => dispatch({
                type: 'bookmarks-add',
                payload: {
                    bookmark: {
                        entity: 'bookmark',
                        _id: uuid(),
                        local: true,
                        bookId,
                        path: path || firstPath(),
                    },
                },
            })}
        />;
    }
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

function BookScreenFooter({
    fragment, path, theme, visible, toggleToc,
}: Themed & {
    fragment: BookFragment,
    path: BookPath,
    visible: boolean,
    toggleToc: () => void,
}) {
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
}