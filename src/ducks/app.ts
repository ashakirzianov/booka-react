import { Epic, ofType, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataAction, UserContext } from './data';
import { AccountState, AccountAction } from './account';
import { ThemeState, ThemeAction } from './theme';
import { BookState, BookAction } from './book';
import { BookmarksAction, BookmarksState } from './bookmarks';
import { HighlightsState, HighlightsAction } from './highlights';
import { CollectionsAction, CollectionsState } from './collections';
import { PositionsAction, PositionsState } from './positions';
import { LocationAction, LocationState, AppLocation } from './location';
import { SearchAction, SearchState } from './search';
import { PopularAction, PopularState } from './popular';

export type AppAction =
    | DataAction
    | AccountAction
    | ThemeAction
    | BookAction
    | BookmarksAction
    | HighlightsAction
    | CollectionsAction
    | PositionsAction
    | LocationAction
    | SearchAction
    | PopularAction
    ;
export type AppActionType = AppAction['type'];
export type ActionForType<T extends AppActionType> =
    Extract<AppAction, { type: T }>;
export type ActionWithPayload = Extract<AppAction, { payload: any }>;
export type PayloadForType<T extends AppActionType> =
    ActionForType<T> extends { payload: infer P } ? P : undefined;

export type AppState = {
    account: AccountState,
    theme: ThemeState,
    book: BookState,
    bookmarks: BookmarksState,
    highlights: HighlightsState,
    collections: CollectionsState,
    positions: PositionsState,
    location: LocationState,
    search: SearchState,
    popular: PopularState,
};

export type AppDependencies = UserContext;

export type AppEpic<Output extends AppAction = AppAction> =
    Epic<AppAction, Output, AppState, AppDependencies>;

export type AppMiddleware =
    (store: { getState: () => AppState }) =>
        (next: (action: AppAction) => AppAction) =>
            (action: AppAction) =>
                AppAction;

export function createAppEpicMiddleware(options: {
    dependencies: AppDependencies,
}) {
    return createEpicMiddleware<AppAction, AppAction, AppState, AppDependencies>(options);
}

type Operator<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppActionType>(
    ...types: T[]
): Operator<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}

type NavigationAction<T extends AppLocation['location']> = ActionForType<'location/navigate'> & {
    payload: Extract<AppLocation, { location: T }>,
};
export function ofAppNavigation<T extends AppLocation['location']>(
    location: T,
): Operator<AppAction, NavigationAction<T>> {
    return filter(
        (action: AppAction): action is NavigationAction<T> =>
            action.type === 'location/navigate' && action.payload.location === location,
    );
}
