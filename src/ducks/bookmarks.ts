import { Bookmark } from 'booka-common';
import { AppAction } from './app';

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
type BookmarksReplaceAllAction = {
    type: 'bookmarks-replace-all',
    payload: {
        bookId: string,
        bookmarks: Bookmark[],
    },
};
type BookmarksReplaceOneAction = {
    type: 'bookmarks-replace-one',
    payload: {
        replaceId: string,
        bookmark: Bookmark,
    },
};
export type BookmarksAction =
    | BookmarksAddAction | BookmarksRemoveAction
    | BookmarksReplaceAllAction | BookmarksReplaceOneAction
    ;

const defaultState: BookmarksState = [];
export function bookmarksReducer(state: BookmarksState = defaultState, action: AppAction): BookmarksState {
    switch (action.type) {
        case 'bookmarks-add':
            return [action.payload.bookmark, ...state];
        case 'bookmarks-remove':
            return state.filter(b => b._id !== action.payload.bookmarkId);
        case 'bookmarks-replace-one':
            return state.map(b =>
                b._id === action.payload.replaceId
                    ? action.payload.bookmark
                    : b
            );
        case 'bookmarks-replace-all':
            return action.payload.bookmarks;
        default:
            return state;
    }
}
