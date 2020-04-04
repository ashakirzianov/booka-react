import { createDataAccess } from '../../ducks';

export const dataAccess = createDataAccess();
export function useDataProvider() {
    return dataAccess.dataProvider();
}
