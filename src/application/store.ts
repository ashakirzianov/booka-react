/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';

import { rootReducer, rootEpic } from '../ducks';
import { startupFbSdk, fbState } from './facebookSdk';
import { config } from '../config';

export const ConnectedProvider: React.SFC = ({ children }) =>
    React.createElement(Provider, { store }, children);

function configureStore() {
    const composeEnhancers: typeof compose =
        // Note: support redux dev tools
        (globalThis.window && (globalThis.window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        || compose;

    const epicMiddleware = createEpicMiddleware();
    const loggerMiddleware = createLogger();
    const middlewares = process.env.NODE_ENV === 'development'
        ? [
            epicMiddleware,
            // loggerMiddleware,
        ]
        : [epicMiddleware];
    const s = createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(...middlewares),
        ),
    );
    epicMiddleware.run(rootEpic);

    return s;
}

const store = configureStore();

startupFbSdk(config().facebook.clientId);
fbState().subscribe(state => {
    if (state.state === 'logged' && state.token) {
        store.dispatch({
            type: 'account-receive-fb-token',
            payload: {
                token: state.token,
            },
        });
    }
});
