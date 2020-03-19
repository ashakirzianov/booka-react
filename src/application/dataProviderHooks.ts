import {
    createContext, useState, useEffect, useContext,
    PropsWithChildren, createElement,
} from 'react';
import { createDataProvider } from '../data';
import { useAccount } from './dataHooks';

const DataProviderContext = createContext(createDataProvider(undefined));

export function useDataProvider() {
    const dp = useContext(DataProviderContext);
    return dp;
}

export function DataProviderProvider({ children }: PropsWithChildren<{}>) {
    const { accountState } = useAccount();
    const token = accountState.state === 'signed' ? accountState.token : undefined;
    const accountId = accountState.state === 'signed' ? accountState.account._id : undefined;
    const [dp, setDp] = useState(createDataProvider(undefined));
    useEffect(() => {
        if (accountId && token) {
            setDp(createDataProvider({ accountId, token }));
        } else {
            setDp(createDataProvider(undefined));
        }
    }, [accountId, token]);

    return createElement(
        DataProviderContext.Provider,
        { value: dp },
        children,
    );
}
