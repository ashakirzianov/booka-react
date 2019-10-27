import { combineEpics, Epic, ofType } from 'redux-observable';
import { AppAction } from '../model';
import { flatMap, mergeMap, map } from 'rxjs/operators';
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
            map((page): AppAction => ({
                type: 'ALLBOOKS_FULFILLED',
                payload: page.values,
            }))
        ),
    ),
);

export const rootEpic = combineEpics(
    fetchLibraryEpic,
    fetchAllBooksEpic,
);
