import { BookPositionLocator, BookFragment } from 'booka-common';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, mergeMap } from 'rxjs/operators';
import { fetchBookFragment } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

export type NoFragment = { state: 'no-fragment' };
export type LoadingFragment = {
    state: 'loading',
    location: BookPositionLocator,
};
export type FragmentReady = {
    state: 'ready',
    location: BookPositionLocator,
    fragment: BookFragment,
};
export type BookFragmentState =
    | NoFragment | LoadingFragment | FragmentReady;

export type BookFragmentOpenAction = {
    type: 'fragment-open',
    payload: BookPositionLocator,
};
export type BookFragmentFulfilledAction = {
    type: 'fragment-fulfilled',
    payload: {
        location: BookPositionLocator,
        fragment: BookFragment,
    },
};
export type BookFragmentAction =
    | BookFragmentOpenAction | BookFragmentFulfilledAction;

const defaultState: BookFragmentState = { state: 'no-fragment' };
export function bookFragmentReducer(state: BookFragmentState = defaultState, action: AppAction): BookFragmentState {
    switch (action.type) {
        case 'fragment-open':
            return {
                state: 'loading',
                location: action.payload,
            };
        case 'fragment-fulfilled':
            return {
                state: 'ready',
                location: action.payload.location,
                fragment: action.payload.fragment,
            };
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('fragment-open'),
    mergeMap(
        action => fetchBookFragment(action.payload).pipe(
            filter((res) => res.success),
            map((res): AppAction => {
                if (res.success) {
                    return {
                        type: 'fragment-fulfilled',
                        payload: {
                            location: action.payload,
                            fragment: res.value,
                        },
                    };
                } else {
                    // TODO: remove
                    throw new Error('should not happen');
                }
            })
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
