import { SignState } from 'booka-common';
import { createStorage } from './storage';
import { authProvider } from './auth';
import { userDataProvider } from './userData';
import { libraryProvider } from './library';

export type DataProvider = ReturnType<typeof createDataProvider>;
export function createDataProvider(sign: SignState) {
    const token = sign.sign === 'signed'
        ? sign.token : undefined;
    const storageKey = sign.sign === 'signed'
        ? sign.accountInfo._id : undefined;
    const storage = createStorage(storageKey);

    return {
        ...authProvider(),
        ...userDataProvider({ token }),
        ...libraryProvider({ token, storage }),
    };
}
