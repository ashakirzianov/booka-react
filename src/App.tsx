import React from 'react';

import { RootProvider } from './application';
import { whileDebug } from './config';
import { Routes } from './render';

export const App: React.FC = () => {
    return <RootProvider>
        <Routes />
    </RootProvider>;
};

whileDebug(async () => {
    // const { default: why } = await import('@welldone-software/why-did-you-render');
    // why(React);
});
