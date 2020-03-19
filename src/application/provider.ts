import { PropsWithChildren, createElement } from 'react';
import { ConnectedProvider } from './store';
import { DataProviderProvider } from './dataProviderHooks';

export function RootProvider({ children }: PropsWithChildren<{}>) {
    return createElement(
        ConnectedProvider, {},
        createElement(
            DataProviderProvider, {},
            children
        ),
    );
}
