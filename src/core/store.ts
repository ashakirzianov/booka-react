/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootReducer, rootEpic } from '../ducks';

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

export const ConnectedProvider: React.SFC = ({ children }) =>
    React.createElement(Provider, { store }, children);
