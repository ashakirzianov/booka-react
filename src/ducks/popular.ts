import { combineEpics } from 'redux-observable';
import { LibraryCard } from 'booka-common';
import { Loadable } from '../core';
import { AppAction, AppEpic, ofAppType } from './app';
import { mergeMap, map } from 'rxjs/operators';

type PopularReceivedAction = {
    type: 'popular/received',
    payload: LibraryCard[],
};
export type PopularAction = PopularReceivedAction;

export type PopularState = Loadable<LibraryCard[]>;
const init: PopularState = { loading: true };
export function popularReducer(state: PopularState = init, action: AppAction): PopularState {
    switch (action.type) {
        case 'popular/received':
            return action.payload;
        case 'data/update-provider':
            return { loading: true };
        default:
            return state;
    }
}

const requestPopularEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('data/update-provider'),
    mergeMap(() => dataProvider().popularBooks().pipe(
        map((cards): AppAction => ({
            type: 'popular/received',
            payload: cards,
        })),
    )),
);

export const popularEpic = combineEpics(
    requestPopularEpic,
);
