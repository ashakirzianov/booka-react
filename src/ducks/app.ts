import { Epic, ofType, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';
import { UserDataProvider } from '../data';
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

export type AppDependencies = UserDataProvider;

export type AppEpic<Output extends AppAction = AppAction> =
    Epic<AppAction, Output, AppState, AppDependencies>;

export function createAppEpicMiddleware(options: {
    dependencies: AppDependencies,
}) {
    return createEpicMiddleware(options);
}

type TransformObservable<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppAction['type']>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}
