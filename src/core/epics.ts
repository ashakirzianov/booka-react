import { combineEpics, Epic, ofType } from 'redux-observable';
import { AppAction } from '../model';
import { flatMap, mergeMap, map, filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { fetchAllBooks } from '../data/library';

const fetchLibraryEpic: Epic<AppAction> = action$ => action$.pipe(
    ofType('library-fetch'),
    flatMap(() => from<AppAction[]>([
        { type: 'allbooks-fetch' },
    ])),
);

const fetchAllBooksEpic: Epic<AppAction> = action$ => action$.pipe(
    ofType('allbooks-fetch'),
    mergeMap(
        () => fetchAllBooks(0).pipe(
            filter(res => res.success),
            map((res): AppAction => {
                if (res.success) {
                    return {
                        type: 'allbooks-fulfilled',
                        payload: res.value.values,
                    };
                } else {
                    throw new Error('should not happen');
                }
            })
        ),
    ),
);

export const rootEpic = combineEpics(
    fetchLibraryEpic,
    fetchAllBooksEpic,
);
