import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    Highlight, HighlightGroup, BookRange,
} from 'booka-common';
import { sameArrays } from '../utils';
import { AppAction } from './app';
import { sideEffectEpic, bookRequestEpic } from './helpers';

type HighlightsRequestAddAction = {
    type: 'highlights-req-add',
    payload: {
        bookId: string,
        group: HighlightGroup,
        range: BookRange,
    },
};
type HighlightsRequestRemoveAction = {
    type: 'highlights-req-remove',
    payload: {
        highlightId: string,
    },
};
type HighlightsRequestChangeGroupAction = {
    type: 'highlights-req-change-group',
    payload: {
        highlightId: string,
        group: HighlightGroup,
    },
};
type HighlightsReceivedAction = {
    type: 'highlights-received',
    payload: Highlight[],
};
export type HighlightsAction =
    | HighlightsRequestAddAction | HighlightsRequestRemoveAction
    | HighlightsRequestChangeGroupAction
    | HighlightsReceivedAction
    ;

export type HighlightsState = Highlight[];
const init: HighlightsState = [];
export function highlightsReducer(state: HighlightsState = init, action: AppAction): HighlightsState {
    switch (action.type) {
        case 'highlights-received':
            if (sameArrays(state, action.payload)) {
                return state;
            } else {
                return action.payload;
            }
        default:
            return state;
    }
}

const requestHighlightsEpic = bookRequestEpic((bookId, { highlightsForId }) => highlightsForId(bookId).pipe(
    map((highlights): AppAction => ({
        type: 'highlights-received',
        payload: highlights,
    })),
));
const requestHighlightsAddEpic = sideEffectEpic(
    'highlights-req-add',
    ({ payload }, dp) =>
        dp.addHighlight(payload.bookId, payload.range, payload.group),
);
const requestHighlightsRemoveEpic = sideEffectEpic(
    'highlights-req-remove',
    ({ payload }, dp) => dp.removeHighlight(payload.highlightId),
);
const requestHighlightsChangeGroupEpic = sideEffectEpic(
    'highlights-req-change-group',
    ({ payload }, dp) =>
        dp.updateHighlightGroup(payload.highlightId, payload.group),
);

export const highlightsEpic = combineEpics(
    requestHighlightsEpic,
    requestHighlightsAddEpic,
    requestHighlightsRemoveEpic,
    requestHighlightsChangeGroupEpic,
);
