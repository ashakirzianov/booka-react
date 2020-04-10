import { createContext, useContext } from 'react';
import { UserContext } from '../../ducks';

const ReactUserContext = createContext<UserContext>(null as any);
export const UserContextProvider = ReactUserContext.Provider;

export function useDataProvider() {
    const userAccess = useContext(ReactUserContext);
    return userAccess.dataProvider();
}
