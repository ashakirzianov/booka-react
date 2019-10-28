import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import { BookPositionLocator, BookFragment } from 'booka-common';
import { fetchBookFragment } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

export type NoFragment = { state: 'no-fragment' };
export type ErrorFragment = {
    state: 'error',
    location: BookPositionLocator,
};
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
    | NoFragment | ErrorFragment | LoadingFragment | FragmentReady;

export type FetchFragmentAction = {
    type: 'fragment-fetch',
    payload: BookPositionLocator,
};
export type FetchFragmentFulfilledAction = {
    type: 'fragment-fulfilled',
    payload: {
        location: BookPositionLocator,
        fragment: BookFragment,
    },
};
export type FetchFragmentRejectedAction = {
    type: 'fragment-rejected',
    payload: BookPositionLocator,
};
export type BookFragmentAction =
    | FetchFragmentAction
    | FetchFragmentFulfilledAction
    | FetchFragmentRejectedAction
    ;

const defaultState: BookFragmentState = { state: 'no-fragment' };
export function bookFragmentReducer(state: BookFragmentState = defaultState, action: AppAction): BookFragmentState {
    switch (action.type) {
        case 'fragment-fetch':
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
        case 'fragment-rejected':
            return {
                state: 'error',
                location: action.payload,
            };
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('fragment-fetch'),
    mergeMap(
        action => fetchBookFragment(action.payload).pipe(
            map((res): AppAction => {
                return {
                    type: 'fragment-fulfilled',
                    payload: {
                        location: action.payload,
                        fragment: res.value,
                    },
                };
            }),
            catchError(() => of<AppAction>({
                type: 'fragment-rejected',
                payload: action.payload,
            })),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
