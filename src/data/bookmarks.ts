import { switchMap } from 'rxjs/operators';
import {
    Bookmark, AuthToken, uuid, BookPath,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { api } from './api';

export function bookmarksProvider(localChangeStore: LocalChangeStore) {
    return {
        bookmarksForId(bookId: string, token?: AuthToken) {
            return api().getBookmarks(bookId, token).pipe(
                switchMap(bs =>
                    localChangeStore.observe(bs, applyChange)
                )
            );
        },
        addBookmark(bookId: string, path: BookPath) {
            localChangeStore.addChange({
                change: 'bookmark-add',
                bookmark: {
                    entity: 'bookmark',
                    _id: uuid(),
                    bookId, path,
                },
            });
        },
        removeBookmark(bookmarkId: string) {
            localChangeStore.addChange({
                change: 'bookmark-remove',
                bookmarkId,
            });
        },
    };
}

function applyChange(bookmarks: Bookmark[], change: LocalChange): Bookmark[] {
    switch (change.change) {
        case 'bookmark-add':
            return [...bookmarks, change.bookmark];
        case 'bookmark-remove':
            return bookmarks.filter(b => b._id !== change.bookmarkId);
        default:
            return bookmarks;
    }
}
