import React from 'react';

import {
    positionForPath, pageForPosition, AugmentedBookFragment, BookPath,
} from 'booka-common';
import {
    useTheme, useBook, useSetTocOpen, useBookId, useBookPath,
} from '../application';
import { Themed, colors } from '../core';
import {
    FixedPanel, View, IconButton, Label, regularSpace, userAreaWidth,
    FullScreenActivityIndicator, Screen, megaSpace, doubleSpace,
} from '../controls';
import { FeedLink } from './Navigation';
import { BookView } from './BookView';
import { TableOfContentsModal } from './TableOfContentsModal';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';

export function BookScreen() {
    const theme = useTheme();
    const bookState = useBook();
    const bookId = useBookId();
    if (!bookId) {
        return null;
    } else if (bookState.fragment.loading) {
        return <FullScreenActivityIndicator
            theme={theme}
        />;
    } else {
        return <BookReady
            theme={theme}
            bookId={bookId}
            controlsVisible={bookState.controls}
            scrollPath={bookState.scrollPath}
            fragment={bookState.fragment}
        />;
    }
}

function BookReady({
    theme, fragment, bookId,
    controlsVisible, scrollPath,
}: Themed & {
    bookId: string,
    fragment: AugmentedBookFragment,
    controlsVisible: boolean,
    scrollPath: BookPath | undefined,
}) {
    return <Screen theme={theme}>
        <Header
            theme={theme}
            bookId={bookId}
            visible={controlsVisible}
        />
        <Footer
            theme={theme}
            fragment={fragment}
            visible={controlsVisible}
        />
        <TableOfContentsModal bookId={bookId} />
        <View style={{
            width: '100%',
            alignItems: 'center',
        }}
        >
            <View style={{
                maxWidth: userAreaWidth,
                paddingTop: megaSpace, paddingBottom: megaSpace,
                paddingLeft: doubleSpace, paddingRight: doubleSpace,
            }}>
                <BookView
                    fragment={fragment}
                    bookId={bookId}
                    scrollPath={scrollPath}
                />
            </View>
        </View>
    </Screen>;
}

function Header({ visible, bookId }: Themed & {
    visible: boolean,
    bookId: string,
}) {
    const path = useBookPath();
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
                <BookmarkButton
                    bookId={bookId}
                    path={path}
                />
                <AppearanceButton />
                <AccountButton />
            </View>
        </View>
    </FixedPanel>;
}

function Footer({
    fragment, theme, visible,
}: Themed & {
    fragment: AugmentedBookFragment,
    visible: boolean,
}) {
    const path = useBookPath() ?? fragment.current.path;
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
    const theme = useTheme();
    return <FeedLink>
        <IconButton
            theme={theme}
            icon='left'
        />
    </FeedLink>;
}

function TocButton() {
    const theme = useTheme();
    const openToc = useSetTocOpen();
    return <IconButton
        theme={theme}
        icon='items'
        callback={() => openToc(true)}
    />;
}
