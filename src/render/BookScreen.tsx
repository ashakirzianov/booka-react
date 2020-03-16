import React, { useState, useCallback } from 'react';

import {
    assertNever, positionForPath, BookPath, BookFragment, BookRange,
} from 'booka-common';

import {
    useTheme, useBook, useHighlights, useUrlActions,
} from '../application';
import {
    Column, point, Row, Themed, Triad, TopBar, EmptyLine,
    Clickable, colors, TextLine, BottomBar,
    TextLink, FullScreenActivityIndicator,
} from '../atoms';
import { pageForPosition } from './common';
import { BookViewComp } from './BookViewComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { LibButton, AddBookmarkButton, TocButton } from './PanelButtons';

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
            // TODO: extract component
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
