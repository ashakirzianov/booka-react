import React from 'react';
import { BookPath, findBookmark } from 'booka-common';
import { useTheme, useBookmarks, useBookmarksActions } from '../application';
import { IconButton } from '../controls';

export function BookmarkButton({ bookId, path }: {
    bookId: string,
    path: BookPath | undefined,
}) {
    const theme = useTheme();
    const bookmarks = useBookmarks();
    const { addBookmark, removeBookmark } = useBookmarksActions();

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
