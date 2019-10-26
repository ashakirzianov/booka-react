import * as React from 'react';
import { createStore } from 'redux';

import { Provider } from 'react-redux';

import { rootReducer } from './reducers';
import { AppAction } from '../model';

const store = createStore(rootReducer);

class AppProvider extends Provider<AppAction> { }
export const ConnectedProvider: React.SFC = ({ children }) =>
    React.createElement(AppProvider, { store }, children);