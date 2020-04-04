import React from 'react';
import { BookPath, findBookmark } from 'booka-common';
import { useTheme, useBookmarks } from '../application';
import { IconButton } from '../controls';

export function BookmarkButton({ bookId, path }: {
    bookId: string,
    path: BookPath | undefined,
}) {
    const { theme } = useTheme();
    const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

    const currentBookmark = path
        ? findBookmark(bookmarks, bookId, path) : undefined;
    if (!path) {
        return null;
    } else if (currentBookmark) {
        return <IconButton
            theme={theme}
            icon='bookmark-solid'
            callback={() => removeBookmark(currentBookmark.uuid)}
        />;
    } else {
        return <IconButton
            theme={theme}
            icon='bookmark-empty'
            callback={() => addBookmark(bookId, path)}
        />;
    }
}
