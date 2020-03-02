import { combineEpics } from 'redux-observable';
import { AppEpic, AppAction } from './app';
import { withLatestFrom, map, mergeMap } from 'rxjs/operators';
import { appAuth, ofAppType } from './utils';
import { getBookmarks } from '../api';

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

export const syncEpic = combineEpics(
    fetchBookmarksEpic,
);
