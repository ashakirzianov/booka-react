import { BookPositionLocator, BookFragment } from 'booka-common';
import { AppAction } from './app';

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
