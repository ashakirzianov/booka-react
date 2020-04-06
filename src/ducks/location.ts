import { BookPath, BookRange } from 'booka-common';
import { AppAction } from './app';

export type FeedLocation = {
    location: 'feed',
    show?: string,
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
// TODO: rename
export type AppLocation = FeedLocation | BookLocation;

type NavigateToLocationAction = {
    type: 'location-navigate',
    payload: AppLocation,
};
type UpdateBookPathAction = {
    type: 'location-update',
    payload: Partial<AppLocation>,
};
export type LocationAction =
    | NavigateToLocationAction | UpdateBookPathAction
    ;

export type LocationState = AppLocation;
const init: LocationState = { location: 'feed' };
export function locationReducer(state: LocationState = init, action: AppAction): LocationState {
    switch (action.type) {
        case 'location-navigate':
            return action.payload;
        case 'location-update':
            return state.location === action.payload.location
                ? { ...state, ...action.payload } as any
                : state;
        default:
            return state;
    }
}
