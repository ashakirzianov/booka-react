import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    BookPath, Bookmark,
} from 'booka-common';
import { sameArrays } from '../utils';
import { AppAction } from './app';
import { sideEffectEpic, bookRequestEpic } from './helpers';

type BookmarksRequestAddAction = {
    type: 'bookmarks-req-add',
    payload: {
        bookId: string,
        path: BookPath,
    },
};
type BookmarksRequestRemoveAction = {
    type: 'bookmarks-req-remove',
    payload: {
        bookmarkId: string,
    },
};
type BookmarksReceivedAction = {
    type: 'bookmarks-received',
    payload: Bookmark[],
};
export type BookmarksAction =
    | BookmarksRequestAddAction | BookmarksRequestRemoveAction
    | BookmarksReceivedAction
    ;

export type BookmarksState = Bookmark[];
const init: BookmarksState = [];
export function bookmarksReducer(state: BookmarksState = init, action: AppAction): BookmarksState {
    switch (action.type) {
        case 'bookmarks-received':
            if (sameArrays(state, action.payload)) {
                return state;
            } else {
                return action.payload;
            }
        default:
            return state;
    }
}

const requestBookmarksEpic = bookRequestEpic((bookId, dp) => dp.bookmarksForId(bookId).pipe(
    map((bookmarks): AppAction => ({
        type: 'bookmarks-received',
        payload: bookmarks,
    })),
));
const requestBookmarksAddEpic = sideEffectEpic(
    'bookmarks-req-add',
    ({ payload }, dp) => dp.addBookmark(payload.bookId, payload.path),
);
const requestBookmarksRemoveEpic = sideEffectEpic(
    'bookmarks-req-remove',
    ({ payload }, dp) => dp.removeBookmark(payload.bookmarkId),
);

export const bookmarksEpic = combineEpics(
    requestBookmarksEpic,
    requestBookmarksAddEpic,
    requestBookmarksRemoveEpic,
);
