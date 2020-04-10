import { createContext, useContext } from 'react';
import { DataAccess } from '../../ducks';

const userContext = createContext<DataAccess>(null as any);
export const UserContextProvider = userContext.Provider;

export function useDataProvider() {
    const userAccess = useContext(userContext);
    return userAccess.dataProvider();
}
