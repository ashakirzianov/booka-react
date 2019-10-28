import { LibraryState, LibraryAction } from './library';
import { ThemeState } from './theme';
import { BookFragmentAction, BookFragmentState } from './bookFragment';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
    currentFragment: BookFragmentState,
};
