import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    CurrentPosition, BookPath,
} from 'booka-common';
import { sameArrays } from '../utils';
import { AppAction } from './app';
import { sideEffectEpic, dataProviderEpic } from './helpers';

type PositionsRequestAddAction = {
    type: 'positions-req-add',
    payload: {
        bookId: string,
        path: BookPath,
    },
};
type PositionsReceivedAction = {
    type: 'positions-received',
    payload: CurrentPosition[],
};
export type PositionsAction =
    | PositionsRequestAddAction | PositionsReceivedAction
    ;

export type PositionsState = CurrentPosition[];
const init: PositionsState = [];
export function positionsReducer(state: PositionsState = init, action: AppAction): PositionsState {
    switch (action.type) {
        case 'positions-received': {
            if (sameArrays(state, action.payload)) {
                return state;
            } else {
                return action.payload;
            }
        }
        default:
            return state;
    }
}

const requestPositionsEpic = dataProviderEpic(dp => dp.currentPositions().pipe(
    map((positions): AppAction => ({
        type: 'positions-received',
        payload: positions,
    })),
));
const requestPositionsAddEpic = sideEffectEpic(
    'positions-req-add',
    ({ payload }, dp) =>
        dp.addCurrentPosition(payload.bookId, payload.path),
);

export const positionsEpic = combineEpics(
    requestPositionsEpic,
    requestPositionsAddEpic,
);
