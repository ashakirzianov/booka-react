// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    pageForPosition, AugmentedBookFragment, positionForPathInFragment,
} from 'booka-common';
import {
    useTheme, useSetTocOpen, useBookPath,
} from '../application';
import { Themed, colors } from '../core';
import {
    FixedPanel, View, IconButton, Label, regularSpace,
} from '../controls';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookmarkButton } from './BookmarkButton';
import { FeedLink } from './Navigation';

export function Header({ visible, bookId, theme }: Themed & {
    visible: boolean,
    bookId: string,
}) {
    const path = useBookPath();
    return <FixedPanel
        placement='top'
        open={visible}
    >
        <div css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            '@media (max-width: 75rem)': {
                backdropFilter: 'blur(4px)',
                boxShadow: `0px 0px 5px ${colors(theme).shadow}`,
                backgroundColor: 'rgba(255,255,255,0.75)',
            },
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
        </div>
    </FixedPanel>;
}

export function Footer({
    fragment, theme, visible,
}: Themed & {
    fragment: AugmentedBookFragment,
    visible: boolean,
}) {
    const path = useBookPath() ?? fragment.current.path;
    const total = fragment.toc
        ? pageForPosition(fragment.toc.length)
        : undefined;
    const currentPage = pageForPosition(positionForPathInFragment(fragment, path));
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
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: regularSpace,
            backdropFilter: 'blur(4px)',
            boxShadow: `0px 0px 5px ${colors(theme).shadow}`,
            backgroundColor: 'rgba(255,255,255,0.75)',
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
        </div>
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
