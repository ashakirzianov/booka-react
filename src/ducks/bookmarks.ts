import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { Bookmark } from 'booka-common';
import { getBookmarks } from '../api';
import { AppAction, AppEpic } from './app';
import { ofAppType, appAuth } from './utils';

export type BookmarksState = Bookmark[];

type BookmarksAddAction = {
    type: 'bookmarks-add',
    payload: {
        bookmark: Bookmark,
    },
};
type BookmarksRemoveAction = {
    type: 'bookmarks-remove',
    payload: {
        bookmarkId: string,
    },
};
type BookmarksFulfilledAction = {
    type: 'bookmarks-fulfilled',
    payload: {
        bookId: string,
        bookmarks: Bookmark[],
    },
};
export type BookmarksAction =
    | BookmarksAddAction | BookmarksRemoveAction
    | BookmarksFulfilledAction
    ;

const defaultState: BookmarksState = [];
export function bookmarksReducer(state: BookmarksState = defaultState, action: AppAction): BookmarksState {
    switch (action.type) {
        case 'bookmarks-fulfilled':
            return action.payload.bookmarks;
        default:
            return state;
    }
}

const fetchBookmarksEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([{ payload }, token]) => getBookmarks(payload.bookId, token).pipe(
            map((bms): AppAction => ({
                type: 'bookmarks-fulfilled',
                payload: {
                    bookId: payload.bookId,
                    bookmarks: bms,
                },
            })),
        ),
    ),
);

export const bookmarksEpic = combineEpics(
    fetchBookmarksEpic,
);
