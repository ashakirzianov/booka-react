import React, { useState, useCallback } from 'react';

import {
    positionForPath, BookPath,
    BookFragment, BookRange, TableOfContents,
} from 'booka-common';

import {
    useTheme, useBook, useHighlights, useUrlActions, usePositions,
} from '../application';
import {
    Column, point, Row, Triad, EmptyLine,
    Clickable, TextLine, Footer,
    FullScreenActivityIndicator,
} from '../atoms';
import { Themed, colors } from '../core';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp, pageForPosition } from './TableOfContentsComp';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';
import { FixedPanel, View, IconButton } from '../controls';
import { ShowTocLink } from './Navigation';

export function BookScreen({ bookId, showToc, path, quote }: {
    bookId: string,
    showToc: boolean,
    path?: BookPath,
    quote?: BookRange,
}) {
    const { theme } = useTheme();
    const { bookState } = useBook({
        bookId, path,
    });
    if (bookState.loading) {
        return <FullScreenActivityIndicator
            theme={theme}
        />;
    } else {
        const { fragment } = bookState;
        const { toc } = fragment;
        return <BookReady
            theme={theme}
            bookId={bookId}
            path={path}
            fragment={fragment}
            toc={toc}
            showToc={showToc}
            quote={quote}
        />;
    }
}

function BookReady({
    theme, fragment, toc, showToc, bookId, path, quote,
}: Themed & {
    bookId: string,
    path: BookPath | undefined,
    fragment: BookFragment,
    quote: BookRange | undefined,
    toc: TableOfContents | undefined,
    showToc: boolean,
}) {

    const { highlights } = useHighlights(bookId);

    const [controlsVisible, setControlsVisible] = useState(true);
    const toggleControls = useCallback(
        () => setControlsVisible(!controlsVisible),
        [controlsVisible, setControlsVisible],
    );

    const { updateBookPath, updateQuoteRange, updateToc } = useUrlActions();
    const { addCurrentPosition } = usePositions();
    const [needToScroll, setNeedToScroll] = useState(true);
    const updatePath = useCallback((p: BookPath | undefined) => {
        if (needToScroll) {
            setNeedToScroll(false);
        }
        updateBookPath(p);
        if (p) {
            addCurrentPosition({ path: p, bookId });
        }
    }, [setNeedToScroll, updateBookPath, addCurrentPosition, needToScroll, bookId]);
    const closeToc = useCallback(
        () => updateToc(false),
        [updateToc],
    );
    const onNavigation = useCallback(
        () => setNeedToScroll(true),
        [setNeedToScroll],
    );

    return <>
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
        <Header
            bookId={bookId}
            path={path}
            theme={theme}
            visible={controlsVisible}
        />
        <BookScreenFooter
            theme={theme}
            fragment={fragment}
            visible={controlsVisible}
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
                        onNavigation={onNavigation}
                    />
                    <EmptyLine />
                </Column>
            </Clickable>
        </Row>
    </>;
}

function Header({
    theme, visible, bookId, path,
}: Themed & {
    bookId: string,
    path: BookPath | undefined,
    visible: boolean,
}) {
    return <FixedPanel
        placement='top'
        open={visible}
    >
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <View style={{
                flexDirection: 'row',
            }}>
                <BackButton />
                <TocButton />
            </View>
            <View style={{
                flexDirection: 'row',
            }}>
                <BookmarkButton bookId={bookId} path={path} />
                <AppearanceButton />
                <AccountButton />
            </View>
        </View>
    </FixedPanel>;
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
    return <Footer theme={theme} open={visible}>
        <Triad
            right={<TextLine
                theme={theme}
                text={
                    nextChapterPage !== undefined
                        ? `${nextChapterPage - currentPage} pages left`
                        : ''
                }
                fontSize='nano'
                color='accent'
            />}
        />
    </Footer>;
}

function BackButton() {
    const { theme } = useTheme();
    const { back } = useUrlActions();
    return <IconButton
        theme={theme}
        icon='left'
        onClick={back}
    />;
}

function TocButton() {
    const { theme } = useTheme();
    return <ShowTocLink toShow={true}>
        <IconButton
            theme={theme}
            icon='items'
        />
    </ShowTocLink>;
}
