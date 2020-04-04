import { AuthToken } from 'booka-common';
import { Storage } from '../core';
import { authProvider } from './auth';
import { userDataProvider } from './userData';
import { libraryProvider } from './library';

export type DataProvider = ReturnType<typeof createDataProvider>;
export function createDataProvider({ storage, token }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    return {
        ...authProvider(),
        ...userDataProvider({ token }),
        ...libraryProvider({ token, storage }),
    };
}
