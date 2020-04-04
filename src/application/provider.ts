import { PropsWithChildren, createElement } from 'react';
import { ConnectedProvider } from './store';

export function RootProvider({ children }: PropsWithChildren<{}>) {
    return createElement(
        ConnectedProvider, {},
        children,
    );
}
