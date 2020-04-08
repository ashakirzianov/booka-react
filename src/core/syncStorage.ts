import storeApi from 'store2';

export type SyncStorage<T = any> = {
    store(value: T, key?: string): boolean,
    restore(key?: string): T | undefined,
    keys(): string[],
    clear(key?: string): void,
    clearAll(): void,
    sub<U>(prefix: string): SyncStorage<U>,
};
export function createSyncStorage<T>(prefix: string): SyncStorage<T> {
    function fullKey(key?: string) {
        return `${prefix}:${key ?? ''}`;
    }
    function keys() {
        return storeApi.keys().filter(k => k.startsWith(prefix));
    }
    return {
        store(value, key) {
            try {
                storeApi.set(fullKey(key), value);
                return true;
            } catch {
                return false;
            }
        },
        restore(key) {
            return storeApi.get(fullKey(key)) as T;
        },
        keys,
        clear(key) {
            storeApi.remove(fullKey(key));
        },
        clearAll() {
            keys().forEach(storeApi.remove);
        },
        sub(subPrefix) {
            return createSyncStorage(`${prefix}/${subPrefix}`);
        },
    };
}
