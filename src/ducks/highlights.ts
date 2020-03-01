import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { Highlight } from 'booka-common';
import { getHighlights } from '../api';
import { AppAction, AppEpic } from './app';
import { ofAppType, appAuth } from './utils';

export type HighlightsState = Highlight[];

type HighlightsAddAction = {
    type: 'highlights-add',
    payload: {
        highlight: Highlight,
    },
};
type HighlightsRemoveAction = {
    type: 'highlight-remove',
    payload: {
        highlightId: string,
    },
};
type HighlightsFulfilledAction = {
    type: 'highlights-fulfilled',
    payload: {
        bookId: string,
        highlights: Highlight[],
    },
};
export type HighlightsAction =
    | HighlightsAddAction | HighlightsRemoveAction | HighlightsFulfilledAction
    ;

const defaultState: HighlightsState = [];
export function highlightsReducer(state: HighlightsState = defaultState, action: AppAction): HighlightsState {
    switch (action.type) {
        case 'highlights-fulfilled':
            return action.payload.highlights;
        default:
            return state;
    }
}

const fetchHighlightsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-open'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([{ payload }, token]) => getHighlights(payload.bookId, token).pipe(
            map((highlights): AppAction => ({
                type: 'highlights-fulfilled',
                payload: {
                    bookId: payload.bookId,
                    highlights,
                },
            })),
        ),
    ),
);

export const highlightsEpic = combineEpics(
    fetchHighlightsEpic,
);
