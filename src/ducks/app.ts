import { Epic, ofType, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';
import { UserDataProvider } from '../data';
import { DataAction } from './data';
import { AccountState, AccountAction } from './account';
import { ThemeState, ThemeAction } from './theme';
import { BookState, BookAction } from './book';

export type AppAction =
    | DataAction
    | AccountAction
    | ThemeAction
    | BookAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    account: AccountState,
    theme: ThemeState,
    book: BookState,
};

export type AppDependencies = UserDataProvider;

export type AppEpic<Output extends AppAction = AppAction> =
    Epic<AppAction, Output, AppState, AppDependencies>;

export function createAppEpicMiddleware(options: {
    dependencies: AppDependencies,
}) {
    return createEpicMiddleware<AppAction, AppAction, AppState, AppDependencies>(options);
}

type TransformObservable<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppAction['type']>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}
