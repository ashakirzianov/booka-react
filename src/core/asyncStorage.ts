import storeApi from 'store2';

export type AsyncStorage<T> = {
    store(value: T, key?: string): Promise<boolean>,
    restore(key?: string): Promise<T | undefined>,
    items(): Promise<Array<[string, T]>>
    clear(key?: string): Promise<void>,
    clearAll(): Promise<void>,
};
export function createAsyncStorage<T>(prefix: string): AsyncStorage<T> {
    function fullKey(key?: string) {
        return `${prefix}:${key ?? ''}`;
    }
    async function keys() {
        return storeApi.keys().filter(k => k.startsWith(prefix));
    }
    return {
        async store(value, key) {
            try {
                storeApi.set(fullKey(key), value);
                return true;
            } catch {
                return false;
            }
        },
        async restore(key) {
            return storeApi.get(fullKey(key)) as T;
        },
        async items() {
            const ks = await keys();
            return Promise.all(
                ks.map(async k => {
                    const value = storeApi.get(k) as T;
                    return [k, value] as [string, T];
                }),
            );
        },
        async clear(key) {
            storeApi.remove(fullKey(key));
        },
        async clearAll() {
            (await keys()).forEach(storeApi.remove);
        },
    };
}
