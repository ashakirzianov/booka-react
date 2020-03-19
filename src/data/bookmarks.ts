import { switchMap, map } from 'rxjs/operators';
import {
    Bookmark, BookPath, localBookmark,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { Api } from './api';

export function bookmarksProvider(localChangeStore: LocalChangeStore, api: Api) {
    return {
        bookmarksForId(bookId: string) {
            return api.getBookmarks(bookId).pipe(
                switchMap(bs =>
                    localChangeStore.observe(bs, applyChange).pipe(
                        map(localBms => localBms.filter(b => b.bookId === bookId))
                    ),
                ),
            );
        },
        addBookmark(bookId: string, path: BookPath) {
            localChangeStore.addChange({
                change: 'bookmark-add',
                bookmark: localBookmark({
                    bookId, path,
                }),
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
            return bookmarks.filter(b => b.uuid !== change.bookmarkId);
        default:
            return bookmarks;
    }
}
