import { ResolvedCurrentPosition } from 'booka-common';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable';
import { getCurrentPositions, sendCurrentPathUpdate } from '../api';
import { AppAction, AppState } from './app';
import { ofAppType, appAuth } from './utils';

export type CurrentPositionsState = ResolvedCurrentPosition[];

type CurrentPositionsFetchAction = {
    type: 'current-positions-fetch',
};
type CurrentPositionsFulfilledAction = {
    type: 'current-positions-fulfilled',
    payload: ResolvedCurrentPosition[],
};
type CurrentPositionsRejectedAction = {
    type: 'current-positions-rejected',
    payload?: any,
};
export type CurrentPositionsAction =
    | CurrentPositionsFetchAction
    | CurrentPositionsFulfilledAction
    | CurrentPositionsRejectedAction
    ;

export function currentPositionsReducer(state: CurrentPositionsState = [], action: AppAction): CurrentPositionsState {
    switch (action.type) {
        case 'current-positions-fulfilled':
            return action.payload;
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
                catchError(err => {
                    return of<AppAction>({
                        type: 'current-positions-rejected',
                        payload: err,
                    });
                }),
            ),
        ),
    );

const updateCurrentPathEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('book-update-path'),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            if (state.account.state === 'signed') {
                sendCurrentPathUpdate({
                    token: state.account.token,
                    bookId: state.book.link.bookId,
                    path: action.payload,
                    source: 'not-implemented',
                }).subscribe();
            }
            return of<AppAction>();
        }),
    );

export const currentPositionsEpic = combineEpics(
    fetchEpic,
    processFetchEpic,
    updateCurrentPathEpic,
);
