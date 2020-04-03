import { mergeMap, takeUntil } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DataProvider } from '../data';
import {
    AppEpic, AppAction, ActionForType, ofAppType, AppActionType,
} from './app';

export function bookDataRequestEpic<T extends AppActionType>(
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

export function bookRequestEpic(
    projection: (action: ActionForType<'book-req'>, dataProvider: DataProvider) => Observable<AppAction>,
): AppEpic {
    return (action$, _, { getCurrentDataProvider }) => action$.pipe(
        ofAppType('book-req'),
        mergeMap(action => projection(action, getCurrentDataProvider()).pipe(
            takeUntil(action$.pipe(
                ofAppType('book-req'),
            )),
        )),
    );
}
