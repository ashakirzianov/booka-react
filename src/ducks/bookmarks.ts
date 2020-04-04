import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { Bookmark } from 'booka-common';
import { AppAction } from './app';
import { bookRequestEpic } from './helpers';

type BookmarksAddAction = {
    type: 'bookmarks-add',
    payload: Bookmark,
};
type BookmarksRemoveAction = {
    type: 'bookmarks-remove',
    payload: {
        bookmarkId: string,
    },
};
type BookmarksReplaceAction = {
    type: 'bookmarks-replace',
    payload: Bookmark[],
};
export type BookmarksAction =
    | BookmarksAddAction | BookmarksRemoveAction
    | BookmarksReplaceAction
    ;

export type BookmarksState = Bookmark[];
const init: BookmarksState = [];
export function bookmarksReducer(state: BookmarksState = init, action: AppAction): BookmarksState {
    switch (action.type) {
        case 'bookmarks-add':
            return [action.payload, ...state];
        case 'bookmarks-remove':
            return state.filter(b => b.uuid !== action.payload.bookmarkId);
        case 'bookmarks-replace':
            return action.payload;
        default:
            return state;
    }
}

const requestBookmarksEpic = bookRequestEpic((bookId, dp) => dp.bookmarksForId(bookId).pipe(
    map((bookmarks): AppAction => ({
        type: 'bookmarks-replace',
        payload: bookmarks,
    })),
));

export const bookmarksEpic = combineEpics(
    requestBookmarksEpic,
);
