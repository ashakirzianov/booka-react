import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import { BookPositionLocator, BookFragment, BookRange } from 'booka-common';
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
    quote?: BookRange,
};
export type FragmentReady = {
    state: 'ready',
    location: BookPositionLocator,
    quote?: BookRange,
    fragment: BookFragment,
};
export type BookFragmentState =
    | NoFragment | ErrorFragment | LoadingFragment | FragmentReady;

export type OpenFragmentAction = {
    type: 'fragment-open',
    payload: {
        location: BookPositionLocator,
        quote?: BookRange,
    },
};
export type FetchFragmentFulfilledAction = {
    type: 'fragment-fulfilled',
    payload: {
        location: BookPositionLocator,
        fragment: BookFragment,
        quote?: BookRange,
    },
};
export type FetchFragmentRejectedAction = {
    type: 'fragment-rejected',
    payload: BookPositionLocator,
};
export type SetQuoteRangeAction = {
    type: 'fragment-set-quote',
    payload: BookRange | undefined,
};
export type BookFragmentAction =
    | OpenFragmentAction
    | FetchFragmentFulfilledAction
    | FetchFragmentRejectedAction
    | SetQuoteRangeAction
    ;

const defaultState: BookFragmentState = { state: 'no-fragment' };
export function bookFragmentReducer(state: BookFragmentState = defaultState, action: AppAction): BookFragmentState {
    switch (action.type) {
        case 'fragment-open':
            return {
                state: 'loading',
                location: action.payload.location,
                quote: action.payload.quote,
            };
        case 'fragment-fulfilled':
            return {
                state: 'ready',
                location: action.payload.location,
                fragment: action.payload.fragment,
                quote: action.payload.quote,
            };
        case 'fragment-rejected':
            return {
                state: 'error',
                location: action.payload,
            };
        case 'fragment-set-quote':
            return state.state === 'ready'
                ? {
                    ...state,
                    quote: action.payload,
                }
                : state;
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('fragment-open'),
    mergeMap(
        action => fetchBookFragment(action.payload.location).pipe(
            map((res): AppAction => {
                return {
                    type: 'fragment-fulfilled',
                    payload: {
                        location: action.payload.location,
                        quote: action.payload.quote,
                        fragment: res.value,
                    },
                };
            }),
            catchError(() => of<AppAction>({
                type: 'fragment-rejected',
                payload: action.payload.location,
            })),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
