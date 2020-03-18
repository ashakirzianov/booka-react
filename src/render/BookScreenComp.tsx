import React, { useState, useCallback } from 'react';

import {
    assertNever, positionForPath, BookPath,
    BookFragment, BookRange, TableOfContents,
} from 'booka-common';

import {
    useTheme, useBook, useHighlights, useUrlActions,
} from '../application';
import {
    Column, point, Row, Themed, Triad, TopBar, EmptyLine,
    Clickable, colors, TextLine, BottomBar,
    TextLink, FullScreenActivityIndicator,
} from '../atoms';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp, pageForPosition } from './TableOfContentsComp';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { LibButton, AddBookmarkButton, TocButton } from './PanelButtons';

export function BookScreenComp({ bookId, showToc, path, quote }: {
    bookId: string,
    showToc: boolean,
    path?: BookPath,
    quote?: BookRange,
}) {
    const { theme } = useTheme();
    const { bookState } = useBook({
        bookId, path,
    });

    switch (bookState.state) {
        case 'loading':
            return <FullScreenActivityIndicator
                theme={theme}
            />;
        case 'ready': {
            const { fragment } = bookState;
            const { toc } = fragment;
            return <BookReadyComp
                theme={theme}
                bookId={bookId}
                path={path}
                fragment={fragment}
                toc={toc}
                showToc={showToc}
                quote={quote}
            />;
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

function BookReadyComp({
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
    const [needToScroll, setNeedToScroll] = useState(true);
    const updatePath = useCallback((p: BookPath | undefined) => {
        setNeedToScroll(false);
        updateBookPath(p);
    }, [setNeedToScroll, updateBookPath]);
    const closeToc = useCallback(
        () => updateToc(false),
        [updateToc],
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
        <BookScreenHeader
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
                    />
                    <EmptyLine />
                </Column>
            </Clickable>
        </Row>
    </>;
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
                    <AccountButton />
                </>}
        />
    </TopBar>;
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
