import { useEffect, useState } from 'react';
import { Bookmark, AuthToken } from 'booka-common';
import { useDataProvider } from './dataProviderHooks';

export type BookmarksState = Bookmark[];
export function useBookmarks(bookId: string, token?: AuthToken) {
    const { bookmarksForId, addBookmark, removeBookmark } = useDataProvider();
    const [bookmarks, setBookmarks] = useState<BookmarksState>([]);
    useEffect(() => {
        const sub = bookmarksForId(bookId).subscribe(setBookmarks);
        return () => sub.unsubscribe();
    }, [bookmarksForId, bookId]);
    return { bookmarks, addBookmark, removeBookmark };
}
