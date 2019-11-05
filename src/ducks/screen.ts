import { AppAction } from './app';

export type ScreenName = 'library' | 'book';
export type ScreenState = ScreenName;

export function screenReducer(state: ScreenState = 'library', action: AppAction): ScreenState {
    switch (action.type) {
        case 'book-open':
            return 'book';
        case 'library-open':
            return 'library';
        default:
            return state;
    }
}
