/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { rootReducer } from './reducers';
import { rootEpic } from './epics';
import { createEpicMiddleware } from 'redux-observable';

function configureStore() {
    const epicMiddleware = createEpicMiddleware();
    const composeEnhancers: typeof compose =
        (globalThis.window && (globalThis.window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) // Note: support redux dev tools
        || compose;
    const s = createStore(
        rootReducer,
        {
            books: [{
                title: 'Hello world',
            }],
        },
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
