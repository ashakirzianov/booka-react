import React, { useState, useCallback, memo } from 'react';

import {
    positionForPath, pageForPosition, BookFragment,
} from 'booka-common';
import { useTheme, useBook, useSetTocOpen } from '../application';
import { Themed, colors } from '../core';
import {
    FixedPanel, View, IconButton, Label, regularSpace, userAreaWidth,
    FullScreenActivityIndicator, Screen, megaSpace, doubleSpace,
    Clickable,
} from '../controls';
import { BookLocation } from '../ducks';
import { FeedLink } from './Navigation';
import { BookView } from './BookView';
import { TableOfContentsModal } from './TableOfContentsModal';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';

export const BookScreen = memo(function BookScreenF({
    location,
}: {
    location: BookLocation,
}) {
    const { theme } = useTheme();
    const bookState = useBook();
    if (bookState.fragment.loading) {
        return <FullScreenActivityIndicator
            theme={theme}
        />;
    } else {
        const { fragment } = bookState;
        return <BookReady
            theme={theme}
            location={location}
            fragment={fragment}
        />;
    }
});

function BookReady({
    theme, fragment, location,
}: Themed & {
    location: BookLocation,
    fragment: BookFragment,
}) {
    const [controlsVisible, setControlsVisible] = useState(true);
    const toggleControls = useCallback(
        () => setControlsVisible(!controlsVisible),
        [controlsVisible, setControlsVisible],
    );

    return <Screen theme={theme}>
        <Header
            theme={theme}
            location={location}
            visible={controlsVisible}
        />
        <Footer
            theme={theme}
            location={location}
            fragment={fragment}
            visible={controlsVisible}
        />
        <TableOfContentsModal
            location={location}
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
                        bookId={location.bookId}
                        fragment={fragment}
                    />
                </View>
            </Clickable>
        </View>
    </Screen>;
}

function Header({ visible, location }: Themed & {
    visible: boolean,
    location: BookLocation,
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
                <BookmarkButton
                    bookId={location.bookId}
                    path={location.path}
                />
                <AppearanceButton />
                <AccountButton />
            </View>
        </View>
    </FixedPanel>;
}

function Footer({
    fragment, location, theme, visible,
}: Themed & {
    fragment: BookFragment,
    location: BookLocation,
    visible: boolean,
}) {
    const path = location.path ?? fragment.current.path;
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
    const openToc = useSetTocOpen();
    return <IconButton
        theme={theme}
        icon='items'
        callback={() => openToc(true)}
    />;
}
