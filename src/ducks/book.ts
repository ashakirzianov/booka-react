import { mergeMap, map, takeUntil } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    AugmentedBookFragment, BookPath, firstPath,
} from 'booka-common';
import { Loadable } from '../core';
import { AppAction, ofAppNavigation, AppEpic } from './app';

type BookReceivedAction = {
    type: 'book/received',
    payload: {
        fragment: AugmentedBookFragment,
        path: BookPath,
    },
};
type BookToggleControls = {
    type: 'book/controls-toggle',
};
export type BookAction =
    | BookReceivedAction | BookToggleControls
    ;

export type BookState = {
    scrollPath: BookPath | undefined,
    fragment: Loadable<AugmentedBookFragment>,
    controls: boolean,
};
const init: BookState = {
    scrollPath: undefined,
    fragment: { loading: true },
    controls: true,
};
export function bookReducer(state: BookState = init, action: AppAction): BookState {
    switch (action.type) {
        case 'location/navigate':
            return action.payload.location === 'book'
                ? {
                    ...state,
                    fragment: { loading: true },
                    scrollPath: action.payload.path,
                    controls: true,
                }
                : state;
        case 'location/update-path':
            return state.scrollPath === undefined
                ? state
                : { ...state, scrollPath: undefined };
        case 'book/received':
            return {
                ...state,
                fragment: action.payload.fragment,
                scrollPath: action.payload.path,
            };
        case 'book/controls-toggle':
            return { ...state, controls: !state.controls };
        default:
            return state;
    }
}

const requestBookEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppNavigation('book'),
    mergeMap(({ payload: { bookId, path: payloadPath, quote, refId } }) => {
        const actualPath = quote?.start ?? payloadPath ?? firstPath();
        const observable = refId
            ? dataProvider().fragmentForRef(bookId, refId)
            : dataProvider().fragmentForPath(bookId, actualPath);
        return observable.pipe(
            map(({ fragment, path }): AppAction => ({
                type: 'book/received',
                payload: {
                    fragment, path,
                },
            })),
            takeUntil(action$.pipe(
                ofAppNavigation('book'),
            )),
        );
    },
    ),
);

export const bookEpic = combineEpics(
    requestBookEpic,
);
