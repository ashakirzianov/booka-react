import { Subject } from 'rxjs';
import {
    Bookmark, AuthToken, BackContract, BookPath, uuid,
} from 'booka-common';
import { config } from '../config';
import { LocalChange, addLocalChange, applyLocalChanges } from './localChange';
import { createFetcher } from './fetcher';
import { map } from 'rxjs/operators';

const back = createFetcher<BackContract>(config().backUrl);
export function bookmarksForId(bookId: string, token?: AuthToken) {
    let bookmarks: Bookmark[] = applyLocalChanges([], applyChange);
    const subject = new Subject<Bookmark[]>();
    subject.next(bookmarks);

    if (token) {
        back.get('/bookmarks', {
            query: { bookId },
            auth: token.token,
        }).pipe(
            map(r => {
                bookmarks = applyLocalChanges(r.value, applyChange);
                return bookmarks;
            }),
        ).subscribe(subject);
    }

    function add(path: BookPath) {
        const bookmark: Bookmark = {
            entity: 'bookmark',
            _id: uuid(),
            bookId, path,
        };
        const change: LocalChange = { change: 'bookmark-add', bookmark };
        addLocalChange(change);
        bookmarks = applyChange(bookmarks, change);
        subject.next(bookmarks);
    }
    function remove(bookmarkId: string) {
        const change: LocalChange = { change: 'bookmark-remove', bookmarkId };
        addLocalChange(change);
        bookmarks = applyChange(bookmarks, change);
        subject.next(bookmarks);
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
