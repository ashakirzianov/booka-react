/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootReducer, rootEpic, AppState, queryForLink } from '../ducks';
import { createBrowserHistory, LocationDescriptorObject } from 'history';
import { throttle } from 'lodash';

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
