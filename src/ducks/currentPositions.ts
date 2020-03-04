import { ResolvedCurrentPosition, LibraryCard, BookPath, replaceOrAdd, EntitySource } from 'booka-common';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable';
import { getCurrentPositions } from '../api';
import { AppAction, AppState } from './app';
import { ofAppType, appAuth } from './utils';

export type CurrentPositionsState = {
    positions: ResolvedCurrentPosition[],
    source: EntitySource,
};

type CurrentPositionsFetchAction = {
    type: 'current-positions-fetch',
};
type CurrentPositionsFulfilledAction = {
    type: 'current-positions-fulfilled',
    payload: ResolvedCurrentPosition[],
};
export type CurrentPositionsAction =
    | CurrentPositionsFetchAction | CurrentPositionsFulfilledAction
    ;

const defaultState: CurrentPositionsState = {
    positions: [],
    source: 'not-implemented',
};
export function currentPositionsReducer(
    state: CurrentPositionsState = defaultState,
    action: AppAction,
): CurrentPositionsState {
    switch (action.type) {
        case 'current-positions-fulfilled':
            return {
                ...state,
                positions: action.payload,
            };
        case 'book-update-path':
            return {
                ...state,
                positions: updateCurrentPositions({
                    currentPositions: state.positions,
                    cardToUpdate: action.payload.card,
                    path: action.payload.path,
                    source: state.source,
                    preview: action.payload.preview,
                }),
            };
        default:
            return state;
    }
}

const fetchEpic: Epic<AppAction> =
    action$ => action$.pipe(
        ofAppType('account-info'),
        mergeMap(
            () => of<AppAction>({
                type: 'current-positions-fetch',
            }),
        ),
    );

const processFetchEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('current-positions-fetch'),
        withLatestFrom(appAuth(state$)),
        mergeMap(
            ([_, token]) => getCurrentPositions(token).pipe(
                map((res): AppAction => {
                    return {
                        type: 'current-positions-fulfilled',
                        payload: res,
                    };
                }),
            ),
        ),
    );

export const currentPositionsEpic = combineEpics(
    fetchEpic,
    processFetchEpic,
);

function updateCurrentPositions({
    currentPositions, cardToUpdate, path, source, preview,
}: {
    currentPositions: ResolvedCurrentPosition[],
    cardToUpdate: LibraryCard,
    path: BookPath,
    source: EntitySource,
    preview: string | undefined,
}): ResolvedCurrentPosition[] {
    const created = new Date(Date.now());
    const existing = currentPositions.find(cp => cp.card.id === cardToUpdate.id);
    if (existing) {
        const locations = replaceOrAdd(
            existing.locations,
            l => l.source === source,
            { source, path, created, preview }
        );
        const replacement = { ...existing, locations };
        return currentPositions.map(
            cp => cp === existing ? replacement : cp
        );
    } else {
        const toAdd: ResolvedCurrentPosition = {
            card: cardToUpdate,
            locations: [{
                source, path, created, preview,
            }],
        };
        return [toAdd, ...currentPositions];
    }
}
