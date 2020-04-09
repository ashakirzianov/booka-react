import { BookPath, BookRange } from 'booka-common';
import { AppAction } from './app';

export type FeedLocation = {
    location: 'feed',
    card?: string,
    search?: string,
};
export type BookLocation = {
    location: 'book',
    bookId: string,
    toc: boolean,
    path?: BookPath,
    quote?: BookRange,
    refId?: string,
};
export type AppLocation = FeedLocation | BookLocation;

type NavigateToAction = {
    type: 'location/navigate',
    payload: AppLocation,
    meta?: { silent?: boolean },
};
type UpdateBookPathAction = {
    type: 'location/update-path',
    payload: BookPath | undefined,
};
type UpdateQuoteRangeAction = {
    type: 'location/update-quote',
    payload: BookRange | undefined,
};
type UpdateTocAction = {
    type: 'location/update-toc',
    payload: boolean,
};
type UpdateSearchAction = {
    type: 'location/update-search',
    payload: string | undefined,
};
type UpdateCardAction = {
    type: 'location/update-card',
    payload: string | undefined,
};
export type LocationAction =
    | NavigateToAction
    | UpdateBookPathAction | UpdateQuoteRangeAction | UpdateTocAction
    | UpdateSearchAction | UpdateCardAction
    ;

export type LocationState = AppLocation;
const init: LocationState = { location: 'feed' };
export function locationReducer(state: LocationState = init, action: AppAction): LocationState {
    switch (action.type) {
        case 'location/navigate':
            return action.payload;
        case 'location/update-path':
            return state.location === 'book'
                ? { ...state, path: action.payload }
                : state;
        case 'location/update-quote':
            return state.location === 'book'
                ? { ...state, quote: action.payload }
                : state;
        case 'location/update-toc':
            return state.location === 'book'
                ? { ...state, toc: action.payload }
                : state;
        case 'location/update-search':
            return state.location === 'feed'
                ? { ...state, search: action.payload }
                : state;
        case 'location/update-card':
            return state.location === 'feed'
                ? { ...state, card: action.payload }
                : state;
        default:
            return state;
    }
}
