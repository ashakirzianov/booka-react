import { mergeMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DataProvider } from '../data';
import {
    AppEpic, AppAction, ActionForType, ofAppType, AppActionType,
} from './app';
import { SyncWorker } from './sync';

export function sideEffectEpic<T extends AppActionType>(
    type: T,
    fn: (action: ActionForType<T>, dataProvider: DataProvider) => void,
): AppEpic {
    return (action$, _, { dataProvider }) => action$.pipe(
        ofAppType(type),
        mergeMap(action => {
            fn(action, dataProvider());
            return of<AppAction>();
        }),
    );
}

export function dataProviderEpic(
    projection: (dataProvider: DataProvider, syncWorker: SyncWorker) => Observable<AppAction>,
): AppEpic {
    return (action$, _, { dataProvider, syncWorker }) => action$.pipe(
        ofAppType('data/update-context'),
        mergeMap(() => projection(dataProvider(), syncWorker()).pipe(
            takeUntil(action$.pipe(
                ofAppType('data/update-context'),
            ))),
        ),
    );
}

export function bookRequestEpic(
    projection: (bookId: string, dataProvider: DataProvider, syncWorker: SyncWorker) => Observable<AppAction>,
): AppEpic {
    return (action$, state$, { dataProvider, syncWorker }) => action$.pipe(
        ofAppType('location/navigate', 'data/update-context'),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const observable =
                action.type === 'location/navigate'
                    && action.payload.location === 'book'
                    ? projection(action.payload.bookId, dataProvider(), syncWorker())
                    : state.location.location === 'book'
                        ? projection(state.location.bookId, dataProvider(), syncWorker())
                        : of<AppAction>();
            return observable.pipe(
                takeUntil(action$.pipe(
                    ofAppType('location/navigate', 'data/update-context'),
                )),
            );
        }),
    );
}
