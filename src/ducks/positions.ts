import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { CurrentPosition } from 'booka-common';
import { AppAction } from './app';
import { dataProviderEpic } from './helpers';

type PositionsAddAction = {
    type: 'positions/add',
    payload: CurrentPosition,
};
type PositionsReplaceAction = {
    type: 'positions/replace',
    payload: CurrentPosition[],
};
export type PositionsAction =
    | PositionsAddAction | PositionsReplaceAction
    ;

export type PositionsState = CurrentPosition[];
const init: PositionsState = [];
export function positionsReducer(state: PositionsState = init, action: AppAction): PositionsState {
    switch (action.type) {
        case 'positions/add': {
            const position = action.payload;
            return [
                position,
                ...state.filter(
                    p => p.bookId !== position.bookId || p.source.id !== position.source.id,
                ),
            ];
        }
        case 'positions/replace':
            return action.payload;
        default:
            return state;
    }
}

const requestPositionsEpic = dataProviderEpic((dp, sync) => dp.getCurrentPositions().pipe(
    map(p => sync.reduce(p, positionsReducer)),
    map((positions): AppAction => ({
        type: 'positions/replace',
        payload: positions,
    })),
));

export const positionsEpic = combineEpics(
    requestPositionsEpic,
);
