import { Epic, ofType, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';
import { UserDataProvider } from '../data';
import { DataAction } from './data';
import { AccountState, AccountAction } from './account';
import { ThemeState, ThemeAction } from './theme';
import { BookState, BookAction } from './book';
import { BookmarksAction, BookmarksState } from './bookmarks';
import { HighlightsState, HighlightsAction } from './highlights';
import { CollectionsAction, CollectionsState } from './collections';
import { PositionsAction, PositionsState } from './positions';
import { UploadAction, UploadState } from './upload';

export type AppAction =
    | DataAction
    | AccountAction
    | ThemeAction
    | BookAction
    | BookmarksAction
    | HighlightsAction
    | CollectionsAction
    | PositionsAction
    | UploadAction
    ;
export type AppActionType = AppAction['type'];
export type ActionForType<T extends AppActionType> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    account: AccountState,
    theme: ThemeState,
    book: BookState,
    bookmarks: BookmarksState,
    highlights: HighlightsState,
    collections: CollectionsState,
    positions: PositionsState,
    upload: UploadState,
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
export function ofAppType<T extends AppActionType>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}
