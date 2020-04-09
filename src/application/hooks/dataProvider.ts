import { createDataAccess } from '../../ducks';
import { createSyncStorage } from '../../core';

export const dataAccess = createDataAccess(createSyncStorage('users'));
export function useDataProvider() {
    return dataAccess.dataProvider();
}
