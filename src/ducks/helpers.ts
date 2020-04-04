import { mergeMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DataProvider } from '../data';
import {
    AppEpic, AppAction, ActionForType, ofAppType, AppActionType,
} from './app';

export function sideEffectEpic<T extends AppActionType>(
    type: T,
    fn: (action: ActionForType<T>, dataProvider: DataProvider) => void,
): AppEpic {
    return (action$, _, { getCurrentDataProvider }) => action$.pipe(
        ofAppType(type),
        mergeMap(action => {
            fn(action, getCurrentDataProvider());
            return of<AppAction>();
        }),
    );
}

export function dataProviderEpic(
    projection: (dataProvider: DataProvider) => Observable<AppAction>,
): AppEpic {
    return (action$, _, { getCurrentDataProvider }) => action$.pipe(
        ofAppType('data-provider-update'),
        mergeMap(() => projection(getCurrentDataProvider()).pipe(
            takeUntil(action$.pipe(
                ofAppType('data-provider-update'),
            ))),
        ),
    );
}

export function bookRequestEpic(
    projection: (bookId: string, dataProvider: DataProvider) => Observable<AppAction>,
): AppEpic {
    return (action$, state$, { getCurrentDataProvider }) => action$.pipe(
        ofAppType('book-req', 'data-provider-update'),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const observable = action.type === 'book-req'
                ? projection(action.payload.bookId, getCurrentDataProvider())
                : projection(state.book.bookId, getCurrentDataProvider());
            return observable.pipe(
                takeUntil(action$.pipe(
                    ofAppType('book-req', 'data-provider-update'),
                )),
            );
        }),
    );
}
