import { mergeMap, map, takeUntil } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    BookFragment, BookPath, firstPath,
} from 'booka-common';
import { Loadable } from '../core';
import { AppAction, ofAppNavigation, AppEpic } from './app';

type BookReceivedAction = {
    type: 'book-received',
    payload: {
        fragment: BookFragment,
    },
};
export type BookAction =
    | BookReceivedAction
    ;

export type BookState = {
    scrollPath: BookPath | undefined,
    fragment: Loadable<BookFragment>,
};
const init: BookState = {
    scrollPath: undefined,
    fragment: { loading: true },
};
export function bookReducer(state: BookState = init, action: AppAction): BookState {
    switch (action.type) {
        case 'location-navigate':
            return action.payload.location === 'book'
                ? { ...state, scrollPath: action.payload.path }
                : state;
        case 'location-update-path':
            return state.scrollPath === undefined
                ? state
                : { ...state, scrollPath: undefined };
        case 'book-received':
            return {
                ...state,
                fragment: action.payload.fragment,
            };
        default:
            return state;
    }
}

const requestBookEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppNavigation('book'),
    mergeMap(({ payload: { bookId, path } }) =>
        dataProvider().fragmentForPath(bookId, path ?? firstPath()).pipe(
            map((fragment): AppAction => ({
                type: 'book-received',
                payload: {
                    fragment,
                },
            })),
            takeUntil(action$.pipe(
                ofAppNavigation('book'),
            )),
        )),
);

export const bookEpic = combineEpics(
    requestBookEpic,
);
