import { LibraryState, LibraryAction } from './library';
import { ThemeState, ThemeAction } from './theme';
import { BookFragmentAction, BookState } from './book';
import { AccountState, AccountAction } from './account';
import { ScreenState } from './screen';
import { SearchAction, SearchState } from './search';
import { CurrentPositionsAction, CurrentPositionsState } from './currentPositions';
import { CollectionsAction, CollectionsState } from './collections';
import { BookmarksAction, BookmarksState } from './bookmarks';
import { HighlightsState, HighlightsAction } from './highlights';
import { Epic } from 'redux-observable';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    | ThemeAction
    | AccountAction
    | SearchAction
    | CurrentPositionsAction
    | CollectionsAction
    | BookmarksAction
    | HighlightsAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
    book: BookState,
    screen: ScreenState,
    account: AccountState,
    search: SearchState,
    currentPositions: CurrentPositionsState,
    collections: CollectionsState,
    bookmarks: BookmarksState,
    highlights: HighlightsState,
};

export type AppEpic = Epic<AppAction, AppAction, AppState>;
