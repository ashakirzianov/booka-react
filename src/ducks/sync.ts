import { of } from 'rxjs';
import { withLatestFrom, map, mergeMap, tap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppEpic, AppAction } from './app';
import { appAuth, ofAppType } from './utils';
import {
    getBookmarks, sendAddBookmark,
    getHighlights, postHighlight, postHighlightUpdate,
    getCollections, postAddToCollection, postRemoveFromCollection,
} from '../api';
import { bookmarksReducer } from './bookmarks';
import { highlightsReducer } from './highlights';
import { collectionsReducer, CollectionsState } from './collections';

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
                    bookmark: result.value,
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
            map((highlights): AppAction => {
                highlights = applyLocalChanges(highlights, highlightsReducer);
                return {
                    type: 'highlights-replace-all',
                    payload: {
                        bookId: action.payload.bookId,
                        highlights,
                    },
                };
            }),
        ),
    ),
);

const postHighlightEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('highlights-add'),
    addLocalChange(),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postHighlight(action.payload.highlight, token).pipe(
            removeLocalChange(action),
            map((result): AppAction => ({
                type: 'highlights-replace-one',
                payload: {
                    replaceId: action.payload.highlight._id,
                    highlight: result.value,
                },
            })),
        ),
    ),
);

const postSetHighlightGroupEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('highlights-set-group'),
    addLocalChange(),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postHighlightUpdate({
            _id: action.payload.highlightId,
            group: action.payload.group,
        }, token).pipe(
            removeLocalChange(action),
            produceNoAction(),
        ),
    ),
);

const fetchCollectionsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('library-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([_, token]) => getCollections(token).pipe(
            map((collections): AppAction => {
                const withLocals = applyLocalChanges<CollectionsState>(
                    { collections },
                    collectionsReducer,
                );
                return {
                    type: 'collections-replace-all',
                    payload: withLocals.collections,
                };
            }),
        ),
    ),
);

const postAddToCollectionEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('collections-add-card'),
    addLocalChange(),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postAddToCollection(action.payload.card.id, action.payload.collection, token).pipe(
            removeLocalChange(action),
            produceNoAction(),
        ),
    ),
);

const postRemoveFromCollectionEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('collections-remove-card'),
    addLocalChange(),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postRemoveFromCollection(action.payload.card.id, action.payload.collection, token).pipe(
            removeLocalChange(action),
            produceNoAction(),
        ),
    ),
);

export const syncEpic = combineEpics(
    fetchBookmarksEpic, postBookmarkEpic,
    fetchHighlightsEpic, postHighlightEpic, postSetHighlightGroupEpic,
    fetchCollectionsEpic, postAddToCollectionEpic, postRemoveFromCollectionEpic,
);

function produceNoAction() {
    // TODO: find better solution to ignore ?
    return mergeMap(() => of<AppAction>());
}

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
