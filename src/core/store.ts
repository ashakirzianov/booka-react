import React from 'react';
import { createStore } from 'redux';

import { Provider } from 'react-redux';

import { rootReducer } from './reducers';

const store = createStore(rootReducer, {
    books: [{
        title: 'Hello world',
    }],
});

export const ConnectedProvider: React.SFC = ({ children }) =>
    React.createElement(Provider, { store }, children);
