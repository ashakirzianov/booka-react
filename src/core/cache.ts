import { SyncStorage } from './syncStorage';

export type Cache<T> = {
    existing: (key: string) => T | undefined,
    add: (key: string, data: T) => void,
};

export function persistentCache<T>(storage: SyncStorage<T>): Cache<T> {
    return {
        existing(key: string): T | undefined {
            const result = storage.restore(key);
            return result;
        },
        add(key: string, data: T) {
            storage.store(data, key);
        },
    };
}

export function memoryCache<T>(): Cache<T> {
    const cache: {
        [k: string]: T | undefined;
    } = {};
    return {
        existing(key: string): T | undefined {
            return cache[key];
        },
        add(key: string, data: T) {
            cache[key] = data;
        },
    };
}
