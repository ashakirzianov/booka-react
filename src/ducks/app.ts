import { LibraryState, LibraryAction } from './library';
import { ThemeState } from './theme';
import { BookFragmentAction, BookFragmentState } from './bookFragment';
import { ControlsVisibilityAction, ControlsVisibilityState } from './controlsVisibility';

export type AppAction =
    | LibraryAction
    | BookFragmentAction
    | ControlsVisibilityAction
    ;
export type ActionForType<T extends AppAction['type']> =
    Extract<AppAction, { type: T }>;

export type AppState = {
    library: LibraryState,
    theme: ThemeState,
    currentFragment: BookFragmentState,
    controlsVisibility: ControlsVisibilityState,
};
