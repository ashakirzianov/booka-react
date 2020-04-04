import React, { useState, useCallback, memo } from 'react';

import {
    positionForPath, BookPath, pageForPosition,
    BookFragment, TableOfContents,
} from 'booka-common';

import {
    useTheme, useUrlQuery, useOpenBook,
} from '../application';

import { Themed, colors } from '../core';
import { BookView } from './BookView';
import { TableOfContentsModal } from './TableOfContentsModal';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';
import {
    FixedPanel, View, IconButton, Label, regularSpace, userAreaWidth,
    FullScreenActivityIndicator, Screen, megaSpace, doubleSpace,
    Clickable,
} from '../controls';
import { ShowTocLink, FeedLink } from './Navigation';

export const BookScreen = memo(function BookScreenF({ bookId }: {
    bookId: string,
}) {
    const { path, refId } = useUrlQuery();
    const { theme } = useTheme();
    const bookState = useOpenBook({
        bookId, path, refId,
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
        />;
    }
});

function BookReady({
    theme, fragment, toc, bookId, path,
}: Themed & {
    bookId: string,
    path: BookPath | undefined,
    fragment: BookFragment,
    toc: TableOfContents | undefined,
}) {
    const [controlsVisible, setControlsVisible] = useState(true);
    const toggleControls = useCallback(
        () => setControlsVisible(!controlsVisible),
        [controlsVisible, setControlsVisible],
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
            path={path}
        />
        <TableOfContentsModal
            bookId={bookId}
        />
        <View style={{
            width: '100%',
            alignItems: 'center',
        }}
        >
            <Clickable callback={toggleControls}>
                <View style={{
                    maxWidth: userAreaWidth,
                    paddingTop: megaSpace, paddingBottom: megaSpace,
                    paddingLeft: doubleSpace, paddingRight: doubleSpace,
                }}>
                    <BookView
                        bookId={bookId}
                        fragment={fragment}
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
    path: BookPath | undefined,
    visible: boolean,
}) {
    path = path ?? fragment.current.path;
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
            padding: regularSpace,
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
                    fontSize='xsmall'
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
                    fontSize='xsmall'
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
