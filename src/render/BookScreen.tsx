import React, { useState, useCallback, useMemo } from 'react';

import {
    assertNever, positionForPath, BookPath, findBookmark, BookFragment, BookRange,
} from 'booka-common';

import {
    useTheme, useBook, useHighlights, useUrlActions, useBookmarks,
} from '../application';
import {
    Column, point, Row, Callback, Themed,
    Triad, IconButton, TopBar, EmptyLine, Clickable,
    PaletteName, PaletteButton, TextButton, Separator, WithPopover,
    colors, TextLine, BottomBar, TagButton, TextLink, IconLink,
    FullScreenActivityIndicator,
} from '../atoms';
import { BookLink } from '../core';
import { pageForPosition } from './common';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { ConnectedAccountButton } from './AccountButton';
import { ShowTocLink } from './Navigation';

export function BookScreen({ bookId, showToc, path, quote }: {
    bookId: string,
    showToc: boolean,
    path?: BookPath,
    quote?: BookRange,
}) {
    const { theme } = useTheme();
    const link = useMemo((): BookLink => ({
        link: 'book',
        bookId, path,
    }), [bookId, path]);
    const { bookState } = useBook(link);
    const { highlights } = useHighlights(bookId);

    const [visible, setVisible] = useState(true);
    const toggleControls = useCallback(
        () => setVisible(!visible),
        [visible, setVisible],
    );

    const { updateBookPath, updateQuoteRange, updateToc } = useUrlActions();
    const [needToScroll, setNeedToScroll] = useState(true);
    const updatePath = useCallback((p: BookPath | undefined) => {
        setNeedToScroll(false);
        updateBookPath(p);
    }, [setNeedToScroll, updateBookPath]);
    const closeToc = useCallback(
        () => updateToc(false),
        [updateToc],
    );

    switch (bookState.state) {
        case 'loading':
            return <FullScreenActivityIndicator
                theme={theme}
            />;
        case 'ready': {
            const { fragment } = bookState;
            const { toc } = fragment;
            return <>
                <BookScreenHeader
                    bookId={bookId}
                    path={path}
                    theme={theme}
                    visible={visible}
                />
                <BookScreenFooter
                    theme={theme}
                    fragment={fragment}
                    visible={visible}
                    // TODO: implement
                    path={fragment.current.path}
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
                                pathToScroll={needToScroll ? path : undefined}
                                updateBookPosition={updatePath}
                                quoteRange={quote}
                                setQuoteRange={updateQuoteRange}
                                openRef={() => undefined}
                            />
                            {
                                toc && showToc
                                    ? <TableOfContentsComp
                                        theme={theme}
                                        toc={toc}
                                        id={bookId}
                                        closeToc={closeToc}
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
            assertNever(bookState);
            return <span>Should not happen</span>;
    }
}

function BookScreenHeader({
    theme, visible, bookId, path,
}: Themed & {
    bookId: string,
    path: BookPath | undefined,
    visible: boolean,
}) {
    return <TopBar
        theme={theme}
        open={visible}
        paddingHorizontal={point(1)}
    >
        <Triad
            left={<LibButton theme={theme} />}
            right={
                <>
                    <AddBookmarkButton bookId={bookId} path={path} />
                    <AppearanceButton />
                    <ConnectedAccountButton />
                </>}
        />
    </TopBar>;
}

function AddBookmarkButton({ bookId, path }: {
    bookId: string,
    path: BookPath | undefined,
}) {
    const { theme } = useTheme();
    const { bookmarks, addBookmark, removeBookmark } = useBookmarks(bookId);

    const currentBookmark = path
        ? findBookmark(bookmarks, bookId, path) : undefined;
    if (!path) {
        return null;
    } else if (currentBookmark) {
        return <TextButton
            theme={theme}
            text='Remove Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => removeBookmark(currentBookmark._id)}
        />;
    } else {
        return <TextButton
            theme={theme}
            text='Add Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => addBookmark(path)}
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

function AppearanceButton() {
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

function TocButton({ theme, total, current }: Themed & {
    current: number,
    total: number | undefined,
}) {
    return <ShowTocLink toShow={true}>
        <TagButton
            theme={theme}
            text={
                total !== undefined
                    ? `${current} of ${total}`
                    : `${current}`
            }
        />
    </ShowTocLink>;
}

function BookScreenFooter({
    fragment, path, theme, visible,
}: Themed & {
    fragment: BookFragment,
    path: BookPath,
    visible: boolean,
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
