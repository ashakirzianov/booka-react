import { combineEpics } from 'redux-observable';
import { AppEpic, AppAction } from './app';
import { withLatestFrom, map, mergeMap } from 'rxjs/operators';
import { appAuth, ofAppType } from './utils';
import {
    getBookmarks, getHighlights, getCollections,
    sendAddBookmark,
} from '../api';

const fetchBookmarksEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => getBookmarks(action.payload.bookId, token).pipe(
            map((bookmarks): AppAction => ({
                type: 'bookmarks-replace-all',
                payload: {
                    bookId: action.payload.bookId,
                    bookmarks,
                },
            })),
        ),
    ),
);

const postBookmarkEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('bookmarks-add'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => sendAddBookmark(action.payload.bookmark, token).pipe(
            map((result): AppAction => ({
                type: 'bookmarks-replace-one',
                payload: {
                    replaceId: action.payload.bookmark._id,
                    bookmark: {
                        ...action.payload.bookmark,
                        local: undefined,
                        _id: result.value._id,
                    },
                },
            })),
        ),
    ),
);

const fetchHighlightsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => getHighlights(action.payload.bookId, token).pipe(
            map((highlights): AppAction => ({
                type: 'highlights-replace-all',
                payload: {
                    bookId: action.payload.bookId,
                    highlights,
                },
            })),
        ),
    ),
);

const fetchCollectionsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('library-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([_, token]) => getCollections(token).pipe(
            map((collections): AppAction => ({
                type: 'collections-replace-all',
                payload: collections.reduce(
                    (res, col) => ({
                        ...res,
                        [col.name]: col,
                    }),
                    {},
                ),
            })),
        ),
    ),
);

export const syncEpic = combineEpics(
    fetchBookmarksEpic,
    fetchHighlightsEpic,
    fetchCollectionsEpic,
    postBookmarkEpic,
);
