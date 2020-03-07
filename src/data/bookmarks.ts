import {
    Bookmark, AuthToken, BackContract, BookPath, uuid,
} from 'booka-common';
import { config } from '../config';
import { LocalChange, connectedState } from './localChange';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
export function bookmarksForId(bookId: string, token?: AuthToken) {
    const { subject, addChange, replaceState } = connectedState([], applyChange);

    if (token) {
        back.get('/bookmarks', {
            query: { bookId },
            auth: token.token,
        }).subscribe(r => replaceState(r.value));
    }

    function add(path: BookPath) {
        addChange({
            change: 'bookmark-add',
            bookmark: {
                entity: 'bookmark',
                _id: uuid(),
                bookId, path,
            },
        });
    }
    function remove(bookmarkId: string) {
        addChange({
            change: 'bookmark-remove',
            bookmarkId,
        });
    }

    return { subject, add, remove };
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
