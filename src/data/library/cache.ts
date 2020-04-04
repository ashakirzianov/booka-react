import { Storage } from '../../core';

export type Cache<T> = {
    existing: (key: string) => T | undefined,
    add: (key: string, data: T) => void,
};
export function cache<T>(storage: Storage): Cache<T> {
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
