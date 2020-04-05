import { combineEpics } from 'redux-observable';
import { BookPath, BookRange } from 'booka-common';
import { AppAction } from './app';

type FeedLink = {
    link: 'feed',
    show?: string,
    search?: string,
};
type BookLink = {
    link: 'book',
    bookId: string,
    toc: boolean,
    path?: BookPath,
    quote?: BookRange,
    refId?: string,
};
export type Link = FeedLink | BookLink;

type OpenLinkAction = {
    type: 'link-open',
    payload: Link,
};
type UpdateBookPathAction = {
    type: 'link-update-path',
    payload: BookPath,
};
export type LinkAction =
    | OpenLinkAction | UpdateBookPathAction
    ;

export type LinkState = Link;
const init: LinkState = { link: 'feed' };
export function linkReducer(state: LinkState = init, action: AppAction): LinkState {
    switch (action.type) {
        case 'link-open':
            return action.payload;
        case 'link-update-path':
            return state.link === 'book'
                ? { ...state, path: action.payload }
                : state;
        default:
            return state;
    }
}

export const linkEpic = combineEpics();
