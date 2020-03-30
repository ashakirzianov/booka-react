import * as React from 'react';
import {
    TableOfContents, pathToString,
} from 'booka-common';

import { Themed } from '../core';
import { Modal, MenuList, MenuListItem, doubleSpace, View } from '../controls';
import { BookPathLink } from './Navigation';

export function TableOfContentsModal({
    theme, toc, id, closeToc, open,
}: Themed & {
    toc: TableOfContents | undefined,
    id: string,
    open: boolean,
    closeToc: () => void,
}) {
    if (!open || !toc) {
        return null;
    }
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
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
                {toc.items.map(item => {
                    return <BookPathLink
                        key={pathToString(item.path)}
                        bookId={id}
                        path={item.path}
                    >
                        <MenuListItem
                            theme={theme}
                            left={item.title}
                            right={`${pageForPosition(item.position)}`}
                            ident={maxLevel - item.level}
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
