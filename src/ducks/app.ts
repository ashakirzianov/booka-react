import { LibraryState, LibraryAction } from './library';
import { ThemeState, ThemeAction } from './theme';
import { BookFragmentAction, BookState } from './book';
import { ControlsVisibilityAction, ControlsVisibilityState } from './controlsVisibility';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    | ThemeAction
    | ControlsVisibilityAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
    book: BookState,
    controlsVisibility: ControlsVisibilityState,
};
