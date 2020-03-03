import React from 'react';

import { ConnectedProvider } from './application';
import { whileDebug } from './config';
import { Routes } from './routes';

export const App: React.FC = () => {
    return <ConnectedProvider>
        <Routes />
    </ConnectedProvider>;
};

whileDebug(async () => {
    const { default: why } = await import('@welldone-software/why-did-you-render');
    why(React);
});
