import { createDataAccess } from '../../ducks';
import { createStorage } from '../../core';

export const dataAccess = createDataAccess(createStorage('users'));
export function useDataProvider() {
    return dataAccess.dataProvider();
}
