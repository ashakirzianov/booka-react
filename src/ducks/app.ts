import { Observable } from 'rxjs';
import { Epic, ofType } from 'redux-observable';
import { ThemeState, ThemeAction } from './theme';
import { AccountState, AccountAction } from './account';

export type AppAction =
    | ThemeAction
    | AccountAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    theme: ThemeState,
    account: AccountState,
};

export type AppEpic = Epic<AppAction, AppAction, AppState>;

type TransformObservable<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppAction['type']>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}
