import { Highlight } from 'booka-common';
import { AppAction } from './app';

export type HighlightsState = Highlight[];

type HighlightsAddAction = {
    type: 'highlights-add',
    payload: {
        highlight: Highlight,
    },
};
type HighlightsRemoveAction = {
    type: 'highlights-remove',
    payload: {
        highlightId: string,
    },
};
type HighlightsSetGroupAction = {
    type: 'highlights-set-group',
    payload: {
        highlightId: string,
        group: string,
    },
};
type HighlightsReplaceAllAction = {
    type: 'highlights-replace-all',
    payload: {
        bookId: string,
        highlights: Highlight[],
    },
};
type HighlightsReplaceOneAction = {
    type: 'highlights-replace-one',
    payload: {
        replaceId: string,
        highlight: Highlight,
    },
};
export type HighlightsAction =
    | HighlightsAddAction | HighlightsRemoveAction
    | HighlightsReplaceAllAction | HighlightsReplaceOneAction
    | HighlightsSetGroupAction
    ;

const defaultState: HighlightsState = [];
export function highlightsReducer(state: HighlightsState = defaultState, action: AppAction): HighlightsState {
    switch (action.type) {
        case 'highlights-add':
            return [action.payload.highlight, ...state];
        case 'highlights-remove':
            return state.filter(h => h._id !== action.payload.highlightId);
        case 'highlights-set-group':
            return state.map(
                h => h._id === action.payload.highlightId
                    ? { ...h, group: action.payload.group }
                    : h
            );
        case 'highlights-replace-one':
            return state.map(h =>
                h._id === action.payload.replaceId
                    ? action.payload.highlight
                    : h
            );
        case 'highlights-replace-all':
            return action.payload.highlights;
        default:
            return state;
    }
}
