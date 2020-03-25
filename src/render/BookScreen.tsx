import React, { useState, useCallback } from 'react';

import {
    positionForPath, BookPath,
    BookFragment, BookRange, TableOfContents,
} from 'booka-common';

import {
    useTheme, useBook, useHighlights, useUrlActions, usePositions,
} from '../application';

import { Themed, colors } from '../core';
import { BookView } from './BookView';
import { TableOfContentsModal, pageForPosition } from './TableOfContentsModal';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';
import {
    FixedPanel, View, IconButton, Label, normalPadding, userAreaWidth,
    FullScreenActivityIndicator, Screen, megaPadding, doublePadding,
    Clickable,
} from '../controls';
import { ShowTocLink, FeedLink } from './Navigation';

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

    return <Screen theme={theme}>
        <Header
            bookId={bookId}
            path={path}
            theme={theme}
            visible={controlsVisible}
        />
        <Footer
            theme={theme}
            fragment={fragment}
            visible={controlsVisible}
            path={fragment.current.path}
        />
        <TableOfContentsModal
            theme={theme}
            toc={toc}
            id={bookId}
            closeToc={closeToc}
            open={showToc}
        />
        <View style={{
            width: '100%',
            alignItems: 'center',
        }}
        >
            <Clickable callback={toggleControls}>
                <View style={{
                    maxWidth: userAreaWidth,
                    paddingTop: megaPadding, paddingBottom: megaPadding,
                    paddingLeft: doublePadding, paddingRight: doublePadding,
                }}>
                    <BookView
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
                </View>
            </Clickable>
        </View>
    </Screen>;
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
                <FeedButton />
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

function Footer({
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
    const currentPageString = total !== undefined
        ? `${currentPage} of ${total}`
        : `${currentPage}`;
    const pagesLeftString = nextChapterPage !== undefined
        ? `${nextChapterPage - currentPage} pages left`
        : '';
    return <FixedPanel placement='bottom' open={visible}>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors(theme).secondary,
            padding: normalPadding,
            shadowColor: colors(theme).secondary,
            shadowRadius: 10,
        }}>
            <View style={{
                flexBasis: 1,
                flexGrow: 1,
                flexShrink: 1,
            }} />
            <View style={{
                flexDirection: 'row',
                flexBasis: 'auto',
                flexGrow: 1,
                flexShrink: 1,
                justifyContent: 'center',
            }}>
                <Label
                    theme={theme}
                    text={currentPageString}
                    size='nano'
                    bold
                />
            </View>
            <View style={{
                flexDirection: 'row',
                minWidth: 'auto',
                flexBasis: 1,
                flexGrow: 1,
                flexShrink: 1,
                justifyContent: 'flex-end',
            }}>
                <Label
                    theme={theme}
                    text={pagesLeftString}
                    size='nano'
                    color='accent'
                />
            </View>
        </View>
    </FixedPanel>;
}

function FeedButton() {
    const { theme } = useTheme();
    return <FeedLink>
        <IconButton
            theme={theme}
            icon='left'
        />
    </FeedLink>;
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
