import { LibraryCard } from 'booka-common';
import { AppAction } from './app';

export type LibraryOpenAction = {
    type: 'library-open',
};
export type ShowCardAction = {
    type: 'card-show',
    payload: LibraryCard,
};
export type CloseCardAction = {
    type: 'card-close',
};

export type LibraryAction =
    | LibraryOpenAction | ShowCardAction | CloseCardAction
    ;

export type LibraryState = {
    books: LibraryCard[],
    show?: LibraryCard,
};

export function libraryReducer(state: LibraryState = { books: [] }, action: AppAction): LibraryState {
    switch (action.type) {
        case 'card-show':
            return { ...state, show: action.payload };
        case 'card-close':
            return { ...state, show: undefined };
        default:
            return state;
    }
}
