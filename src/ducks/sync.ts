import { of, MonoTypeOperatorFunction } from 'rxjs';
import { withLatestFrom, map, mergeMap, tap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppEpic, AppAction } from './app';
import { appAuth, ofAppType } from './utils';
import {
    getBookmarks, getHighlights, getCollections,
    sendAddBookmark, postHighlight, postAddToCollection,
} from '../api';
import { bookmarksReducer } from './bookmarks';

const fetchBookmarksEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => getBookmarks(action.payload.bookId, token).pipe(
            map((bookmarks): AppAction => {
                bookmarks = applyLocalChanges(bookmarks, bookmarksReducer);
                return {
                    type: 'bookmarks-replace-all',
                    payload: {
                        bookId: action.payload.bookId,
                        bookmarks,
                    },
                };
            }),
        ),
    ),
);

const postBookmarkEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('bookmarks-add'),
    addLocalChange(),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => sendAddBookmark(action.payload.bookmark, token).pipe(
            removeLocalChange(action),
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

const postHighlightEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('highlights-add'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postHighlight(action.payload.highlight, token).pipe(
            map((result): AppAction => ({
                type: 'highlights-replace-one',
                payload: {
                    replaceId: action.payload.highlight._id,
                    highlight: {
                        ...action.payload.highlight,
                        local: undefined,
                        _id: result.value._id,
                    },
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

const postAddToCollectionEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('collections-add-card'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postAddToCollection(action.payload.card.id, action.payload.collection, token).pipe(
            mergeMap(() => of<AppAction>()),
        ),
    ),
);

export const syncEpic = combineEpics(
    fetchBookmarksEpic, fetchHighlightsEpic, fetchCollectionsEpic,
    postBookmarkEpic, postHighlightEpic, postAddToCollectionEpic,
);

let locals: AppAction[] = [];
function addLocalChange<A extends AppAction>() {
    return tap<A>(
        action => locals = [action, ...locals],
    );
}
function removeLocalChange<T>(action: AppAction) {
    return tap<T>(
        () => locals = locals.filter(c => c !== action),
    );
}
function applyLocalChanges<T>(state: T, reducer: (s: T, a: AppAction) => T) {
    return locals.reduce(
        reducer,
        state,
    );
}
