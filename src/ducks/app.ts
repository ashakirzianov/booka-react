import { LibraryState, LibraryAction } from './library';
import { ThemeState } from './theme';
import { BookFragmentAction, BookFragmentState } from './bookFragment';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    ;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
    currentFragment: BookFragmentState,
};
