import { combineEpics, Epic, ofType } from 'redux-observable';
import { AppAction } from '../model';
import { flatMap, mergeMap, map, filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { fetchAllBooks } from '../data/library';

const fetchLibraryEpic: Epic<AppAction> = action$ => action$.pipe(
    ofType('LIBRARY_FETCH'),
    flatMap(() => from([
        { type: 'ALLBOOKS_FETCH' } as const,
    ])),
);

const fetchAllBooksEpic: Epic<AppAction> = action$ => action$.pipe(
    ofType('ALLBOOKS_FETCH'),
    mergeMap(
        () => fetchAllBooks(0).pipe(
            filter(res => res.success),
            map((res): AppAction => {
                if (res.success) {
                    return {
                        type: 'ALLBOOKS_FULFILLED',
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
