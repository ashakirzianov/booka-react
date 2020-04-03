import { PropsWithChildren, createElement } from 'react';
import { ConnectedProvider } from './store';
import { DataProviderProvider } from './hooks/dataProvider';

export function RootProvider({ children }: PropsWithChildren<{}>) {
    return createElement(
        ConnectedProvider, {},
        createElement(
            DataProviderProvider, {},
            children,
        ),
    );
}
