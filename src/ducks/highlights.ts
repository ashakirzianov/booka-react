import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { Highlight, HighlightGroup } from 'booka-common';
import { AppAction } from './app';
import { bookRequestEpic } from './helpers';

type HighlightsAddAction = {
    type: 'highlights/add',
    payload: Highlight,
};
type HighlightsRemoveAction = {
    type: 'highlights/remove',
    payload: {
        highlightId: string,
    },
};
type HighlightsChangeGroupAction = {
    type: 'highlights/change-group',
    payload: {
        highlightId: string,
        group: HighlightGroup,
    },
};
type HighlightsReplaceAction = {
    type: 'highlights/replace',
    payload: Highlight[],
};
export type HighlightsAction =
    | HighlightsAddAction | HighlightsRemoveAction
    | HighlightsChangeGroupAction
    | HighlightsReplaceAction
    ;

export type HighlightsState = Highlight[];
const init: HighlightsState = [];
export function highlightsReducer(state: HighlightsState = init, action: AppAction): HighlightsState {
    switch (action.type) {
        case 'highlights/add':
            return [action.payload, ...state];
        case 'highlights/remove':
            return state.filter(h => h.uuid !== action.payload.highlightId);
        case 'highlights/change-group':
            return state.map(
                h => h.uuid === action.payload.highlightId
                    ? {
                        ...h,
                        group: action.payload.group,
                    }
                    : h,
            );
        case 'highlights/replace':
            return action.payload;
        default:
            return state;
    }
}

const requestHighlightsEpic = bookRequestEpic((bookId, { getHighlights }, sync) => getHighlights(bookId).pipe(
    map(hs => sync.reduce(hs, highlightsReducer)),
    map((highlights): AppAction => ({
        type: 'highlights/replace',
        payload: highlights,
    })),
));

export const highlightsEpic = combineEpics(
    requestHighlightsEpic,
);
