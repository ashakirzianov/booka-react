import * as React from 'react';
import {
    TableOfContents, pathToString, Bookmark, pathLessThan, BookPath,
} from 'booka-common';

import { Themed } from '../core';
import { Modal, MenuList, MenuListItem, doubleSpace, View } from '../controls';
import { BookPathLink } from './Navigation';

export function TableOfContentsModal({
    theme, toc, id, closeToc, open, bookmarks,
}: Themed & {
    toc: TableOfContents | undefined,
    bookmarks: Bookmark[],
    id: string,
    open: boolean,
    closeToc: () => void,
}) {
    if (!open || !toc) {
        return null;
    }

    const items = buildDisplayItems({ toc, bookmarks });

    return <Modal
        theme={theme}
        title='Table of Contents'
        close={closeToc}
        open={open}
    >
        <View style={{
            marginTop: doubleSpace,
        }}>
            <MenuList theme={theme}>
                {items.map(item => {
                    return <BookPathLink
                        key={pathToString(item.path)}
                        bookId={id}
                        path={item.path}
                    >
                        <MenuListItem
                            theme={theme}
                            left={item.title}
                            right={item.page}
                            ident={item.level}
                            italic={item.kind !== 'chapter'}
                            icon={
                                item.kind === 'bookmark'
                                    ? 'bookmark-empty'
                                    : undefined
                            }
                        />
                    </BookPathLink>;
                },
                )}
            </MenuList>
        </View>
    </Modal>;
}

export function pageForPosition(position: number): number {
    return Math.floor(position / 1500) + 1;
}

type DisplayItem = {
    kind: 'chapter' | 'bookmark' | 'current',
    title: string,
    page?: string,
    level: number,
    path: BookPath,
};
function buildDisplayItems({
    toc, bookmarks,
}: {
    toc: TableOfContents,
    bookmarks: Bookmark[],
}): DisplayItem[] {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    const result: DisplayItem[] = [];
    let lastLevel = 0;
    for (const tocItem of toc.items) {
        for (const bm of [...bookmarks]) {
            if (pathLessThan(bm.path, tocItem.path)) {
                result.push({
                    kind: 'bookmark',
                    title: 'your bookmark',
                    level: lastLevel + 1,
                    path: bm.path,
                });
                bookmarks = bookmarks.filter(b => b !== bm);
            }
        }
        result.push({
            kind: 'chapter',
            title: tocItem.title,
            page: `${pageForPosition(tocItem.position)}`,
            level: maxLevel - tocItem.level,
            path: tocItem.path,
        });
        lastLevel = tocItem.level;
    }

    return result;
}
