import { userDataProvider } from '../../data';

export const udp = userDataProvider();
export function useDataProvider() {
    return udp.getCurrentDataProvider();
}
