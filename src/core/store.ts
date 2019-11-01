/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootReducer, rootEpic, AppState, BookLink } from '../ducks';
import { createBrowserHistory, LocationDescriptorObject } from 'history';
import { throttle } from 'lodash';
import { pathToString, rangeToString } from 'booka-common';
import { stringify } from 'query-string';

export const ConnectedProvider: React.SFC = ({ children }) =>
    React.createElement(Provider, { store }, children);

function configureStore() {
    const epicMiddleware = createEpicMiddleware();
    const composeEnhancers: typeof compose =
        // Note: support redux dev tools
        (globalThis.window && (globalThis.window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        || compose;
    const s = createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(
                epicMiddleware,
            ),
        ),
    );
    epicMiddleware.run(rootEpic);

    return s;
}

const store = configureStore();

const history = createBrowserHistory();
store.subscribe(throttle(() => {
    const state = store.getState();
    const location = locationForState(state);
    history.replace(location);
}, 1000, {
    trailing: true,
    leading: false,
}));

function locationForState(state: AppState): LocationDescriptorObject {
    const query = queryForLink(state.book.link);
    return {
        search: query,
    };
}

export function linkToString(link: BookLink): string {
    const query = queryForLink(link);
    return `/book/${link.bookId}${query ? '?' + query : ''}`;
}

export function queryForLink(link: BookLink): string {
    const queryObject: { [k: string]: string } = {};
    if (link.path) {
        queryObject.p = pathToString(link.path);
    }
    if (link.refId) {
        queryObject.ref = link.refId;
    }
    if (link.quote) {
        queryObject.q = rangeToString(link.quote);
    }
    if (link.toc) {
        queryObject.toc = 'true';
    }

    const query = stringify(queryObject);
    return query;
}
