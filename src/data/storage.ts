import storeFn from 'store2';

export type StorageCell<T> = {
    store: (data: T) => void,
    restore: () => T | undefined,
};

export type Storage = ReturnType<typeof createStorage>;
export function createStorage() {
    return storage('');
}

function storage(prefix: string) {
    return {
        cell<T>(key: string): StorageCell<T> {
            const fullKey = `${prefix}:${key}`;
            return {
                store(data) {
                    storeFn(fullKey, data);
                },
                restore() {
                    return storeFn(fullKey);
                },
            };
        },
        sub(p: string) {
            return storage(`${prefix}.${p}`);
        },
    };
}
