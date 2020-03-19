import React from 'react';

import { BookPath, findBookmark } from 'booka-common';
import { useTheme, useBookmarks } from '../application';
import { TextButton, Themed, TagButton, IconLink } from '../atoms';
import { ShowTocLink } from './Navigation';

export function AddBookmarkButton({ bookId, path }: {
    bookId: string,
    path: BookPath | undefined,
}) {
    const { theme } = useTheme();
    const { bookmarks, addBookmark, removeBookmark } = useBookmarks(bookId);

    const currentBookmark = path
        ? findBookmark(bookmarks, bookId, path) : undefined;
    if (!path) {
        return null;
    } else if (currentBookmark) {
        return <TextButton
            theme={theme}
            text='Remove Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => removeBookmark(currentBookmark.uuid)}
        />;
    } else {
        return <TextButton
            theme={theme}
            text='Add Bookmark'
            fontSize='small'
            fontFamily='menu'
            onClick={() => addBookmark(bookId, path)}
        />;
    }
}

export function LibButton({ theme }: Themed) {
    return <IconLink
        theme={theme}
        icon='left'
        to='/'
    />;
}

export function TocButton({ theme, total, current }: Themed & {
    current: number,
    total: number | undefined,
}) {
    return <ShowTocLink toShow={true}>
        <TagButton
            theme={theme}
            text={
                total !== undefined
                    ? `${current} of ${total}`
                    : `${current}`
            }
        />
    </ShowTocLink>;
}
