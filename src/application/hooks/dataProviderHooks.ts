import {
    createContext, useState, useEffect, useContext,
    PropsWithChildren, createElement,
} from 'react';
import { createDataProvider } from '../../data';
import { useAccount } from './accountHooks';

const DataProviderContext = createContext(
    createDataProvider({ sign: 'not-signed' }),
);

export function useDataProvider() {
    const dp = useContext(DataProviderContext);
    return dp;
}

export function DataProviderProvider({ children }: PropsWithChildren<{}>) {
    const { accountState } = useAccount();
    const token = accountState.state === 'signed' ? accountState.token : undefined;
    const accountInfo = accountState.state === 'signed' ? accountState.account : undefined;
    const [dp, setDp] = useState(createDataProvider({ sign: 'not-signed' }));
    useEffect(() => {
        if (accountInfo && token) {
            setDp(createDataProvider({ sign: 'signed', accountInfo, token }));
        } else {
            setDp(createDataProvider({ sign: 'not-signed' }));
        }
    }, [accountInfo, token]);

    return createElement(
        DataProviderContext.Provider,
        { value: dp },
        children,
    );
}
