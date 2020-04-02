import React, { useCallback } from 'react';
import {
    TableOfContents, pathToString, Bookmark, BookPath,
    CurrentPosition, comparePaths, EntitySource, sourceToString,
    pageForPosition,
} from 'booka-common';

import { Themed } from '../core';
import { Modal, MenuList, MenuListItem, doubleSpace, View, IconName } from '../controls';
import {
    useBookmarks, usePositions, useUrlActions, useUrlQuery,
} from '../application';
import { BookPathLink } from './Navigation';

export function TableOfContentsModal({
    theme, toc, bookId,
}: Themed & {
    toc: TableOfContents | undefined,
    bookId: string,
}) {
    const { updateToc } = useUrlActions();
    const closeToc = useCallback(
        () => updateToc(false),
        [updateToc],
    );
    const { bookmarks } = useBookmarks(bookId);
    const { positions } = usePositions();
    const { showToc } = useUrlQuery();

    if (!toc) {
        return null;
    }

    const items = buildDisplayItems({
        toc, bookmarks,
        currents: positions.filter(p => p.bookId === bookId),
    });

    return <Modal
        theme={theme}
        title='Table of Contents'
        close={closeToc}
        open={showToc}
    >
        <View style={{
            marginTop: doubleSpace,
        }}>
            <MenuList theme={theme}>
                {items.map(item => {
                    return <BookPathLink
                        key={pathToString(item.path)}
                        bookId={bookId}
                        path={item.path}
                    >
                        <MenuListItem
                            theme={theme}
                            left={item.title}
                            right={item.page}
                            ident={item.level}
                            italic={item.kind !== 'chapter'}
                            icon={item.icon}
                        />
                    </BookPathLink>;
                },
                )}
            </MenuList>
        </View>
    </Modal>;
}

type DisplayItem = {
    kind: 'chapter' | 'bookmark' | 'current',
    title: string,
    page?: string,
    level: number,
    path: BookPath,
    icon?: IconName,
};
function buildDisplayItems({
    toc, bookmarks, currents,
}: {
    toc: TableOfContents,
    bookmarks: Bookmark[],
    currents: CurrentPosition[],
}): DisplayItem[] {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    const fromToc = toc.items.map<DisplayItem>(item => ({
        kind: 'chapter',
        title: item.title,
        page: `${pageForPosition(item.position)}`,
        level: maxLevel - item.level,
        path: item.path,
    }));
    const fromBookmarks = bookmarks.map<DisplayItem>(bm => ({
        kind: 'bookmark',
        title: 'your bookmark',
        level: 0,
        path: bm.path,
        icon: 'bookmark-empty',
    }));
    const fromCurrents = currents.map<DisplayItem>(cur => ({
        kind: 'current',
        title: `currently at ${sourceToString(cur.source)}`,
        level: 0,
        path: cur.path,
        icon: iconForSource(cur.source),
    }));
    const items = [...fromToc, ...fromBookmarks, ...fromCurrents]
        .sort((a, b) => comparePaths(a.path, b.path));
    let lastLevel = 0;
    for (const item of items) {
        if (item.kind !== 'chapter') {
            item.level = lastLevel + 1;
        } else {
            lastLevel = item.level;
        }
    }

    return items;
}

function iconForSource(source: EntitySource): IconName {
    switch (source.kind) {
        case 'safari':
            return 'safari';
        case 'chrome':
            return 'chrome';
        case 'firefox':
            return 'firefox';
        case 'edge':
            return 'edge';
        case 'ie':
            return 'ie';
        default:
            return source.mobile
                ? 'mobile'
                : 'desktop';
    }
}
