/*global globalThis*/
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { throttle } from 'lodash';
import { createLogger } from 'redux-logger';

import { rootReducer, rootEpic } from '../ducks';
import { updateHistoryFromState } from './history';
import { startupFbSdk } from '../atoms';
import { config } from '../config';
import { fbState } from '../atoms/facebookSdk';

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
            loggerMiddleware,
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

store.subscribe(throttle(() => {
    const state = store.getState();
    updateHistoryFromState(state);
}, 1000, {
    trailing: true,
    leading: false,
}));

startupFbSdk(config().facebook.clientId);
fbState().subscribe(state => {
    if (state.state === 'logged' && state.token) {
        store.dispatch({
            type: 'account-fb-token',
            payload: {
                token: state.token,
            },
        });
    }
});
