import { Change } from '../core';
import { AppAction } from './app';

export type ChangesState = Change[];

type ChangesAddAction = {
    type: 'changes-add',
    payload: Change,
};
type ChangesPostedAction = {
    type: 'changes-posted',
    payload: Change,
};
export type ChangesAction =
    | ChangesAddAction | ChangesPostedAction
    ;

const defaultState: ChangesState = [];
export function changesReducer(state: ChangesState = defaultState, action: AppAction): ChangesState {
    switch (action.type) {
        case 'changes-add':
            return [action.payload, ...state];
        case 'changes-posted':
            // TODO: be careful! ref comparison here
            return state.filter(ch => ch !== action.payload);
        default:
            return state;
    }
}
