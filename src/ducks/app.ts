import { LibraryState, LibraryAction } from './library';
import { ThemeState } from './theme';

export type AppAction =
    | LibraryAction
    ;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
};
