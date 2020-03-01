import { LibraryState, LibraryAction } from './library';
import { ThemeState, ThemeAction } from './theme';
import { BookFragmentAction, BookState } from './book';
import { AccountState, AccountAction } from './account';
import { ScreenState } from './screen';
import { SearchAction, SearchState } from './search';
import { RecentBooksAction, RecentBooksState } from './recentBooks';
import { CollectionsAction, CollectionsState } from './collections';
import { BookmarksAction, BookmarksState } from './bookmarks';
import { Epic } from 'redux-observable';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    | ThemeAction
    | AccountAction
    | SearchAction
    | RecentBooksAction
    | CollectionsAction
    | BookmarksAction
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
    recentBooks: RecentBooksState,
    collections: CollectionsState,
    bookmarks: BookmarksState,
};

export type AppEpic = Epic<AppAction, AppAction, AppState>;
