import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { CurrentPosition, BookPath, EntitySource } from 'booka-common';
import { AppAction } from './app';
import { dataProviderEpic } from './helpers';

type PositionsAddAction = {
    type: 'positions-add',
    payload: {
        bookId: string,
        path: BookPath,
        source: EntitySource,
    },
};
type PositionsReplaceAction = {
    type: 'positions-replace',
    payload: CurrentPosition[],
};
export type PositionsAction =
    | PositionsAddAction | PositionsReplaceAction
    ;

export type PositionsState = CurrentPosition[];
const init: PositionsState = [];
export function positionsReducer(state: PositionsState = init, action: AppAction): PositionsState {
    switch (action.type) {
        case 'positions-add': {
            const position: CurrentPosition = {
                uuid: '', // TODO: remove uuid from model
                source: action.payload.source,
                bookId: action.payload.bookId,
                path: action.payload.path,
                created: new Date(Date.now()),
            };
            return [
                position,
                ...state.filter(
                    p => p.bookId !== position.bookId || p.source.id !== position.source.id,
                ),
            ];
        }
        case 'positions-replace':
            return action.payload;
        default:
            return state;
    }
}

const requestPositionsEpic = dataProviderEpic(dp => dp.currentPositions().pipe(
    map((positions): AppAction => ({
        type: 'positions-replace',
        payload: positions,
    })),
));

export const positionsEpic = combineEpics(
    requestPositionsEpic,
);
