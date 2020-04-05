import { BookPath } from 'booka-common';
import { combineEpics } from 'redux-observable';
import { AppAction } from './app';

type FeedLink = {
    link: 'feed',
    show?: string,
};
type BookLink = {
    link: 'book',
    bookId: string,
    path?: BookPath,
    refId?: string,
};
export type Link = FeedLink | BookLink;

type OpenLinkAction = {
    type: 'link-open',
    link: Link,
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
        default:
            return state;
    }
}

export const linkEpic = combineEpics();
