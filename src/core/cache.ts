import { AppStorage } from './storage';

export type Cache<T> = {
    existing: (key: string) => T | undefined,
    add: (key: string, data: T) => void,
};

export function persistentCache<T>(storage: AppStorage): Cache<T> {
    return {
        existing(key: string): T | undefined {
            const result = storage.cell<T>(key).restore();
            return result;
        },
        add(key: string, data: T) {
            storage.cell<T>(key).store(data);
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
