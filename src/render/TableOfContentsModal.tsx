import * as React from 'react';
import {
    TableOfContents, pathToString,
} from 'booka-common';

import { Themed } from '../core';
import { Modal, MenuList, MenuListItem } from '../controls';
import { BookPathLink } from './Navigation';

export function TableOfContentsModal({
    theme, toc, id, closeToc,
}: Themed & {
    toc: TableOfContents,
    id: string,
    closeToc: () => void,
}) {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Modal
        theme={theme}
        title={toc.title}
        close={closeToc}
        open={true}
    >
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
    </Modal>;
}

export function pageForPosition(position: number): number {
    return Math.floor(position / 1500) + 1;
}
