import { get, set, del, keys } from 'idb-keyval';

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
    async function localKeys() {
        return (await keys()).filter(k => typeof k === 'string' && k.startsWith(prefix));
    }
    return {
        async store(value, key) {
            try {
                await set(fullKey(key), value);
                return true;
            } catch {
                return false;
            }
        },
        async restore(key) {
            return get(fullKey(key));
        },
        async items() {
            const ks = await localKeys();
            return Promise.all(
                ks.map(async k => {
                    const value = await get<T>(k);
                    return [k, value] as [string, T];
                }),
            );
        },
        async clear(key) {
            return del(fullKey(key));
        },
        async clearAll() {
            const ks = await localKeys();
            await Promise.all(ks.map(k => del(k)));
        },
    };
}
