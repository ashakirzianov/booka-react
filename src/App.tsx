import React from 'react';

import { RootProvider } from './application';
import { Routes } from './render';

export const App: React.FC = () => {
    return <RootProvider>
        <Routes />
    </RootProvider>;
};
