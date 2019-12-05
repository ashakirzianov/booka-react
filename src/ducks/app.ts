import { LibraryState, LibraryAction } from './library';
import { ThemeState, ThemeAction } from './theme';
import { BookFragmentAction, BookState } from './book';
import { AccountState, AccountAction } from './account';
import { ScreenState } from './screen';
import { SearchAction, SearchState } from './search';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    | ThemeAction
    | AccountAction
    | SearchAction
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
};
