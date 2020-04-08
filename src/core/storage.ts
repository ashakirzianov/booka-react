import storeApi from 'store2';

export type StorageCell<T> = {
    store: (value: T) => boolean,
    restore: () => T | undefined,
    date: () => Date | undefined,
    clear: () => void,
};
export type AppStorage = ReturnType<typeof createStorage>;
export function createStorage(prefix: string) {
    type CellData<T> = {
        value: T,
        date: number,
    };
    function restoreCellData<T>(key: string): CellData<T> | undefined {
        return storeApi.get(key);
    }
    function makeCell<T>(key: string): StorageCell<T> {
        const fullKey = `${prefix}:${key}`;
        return {
            store(value) {
                try {
                    const data: CellData<T> = {
                        value, date: Date.now(),
                    };
                    storeApi.set(fullKey, data);
                    return true;
                } catch {
                    return false;
                }
            },
            restore() {
                const data = restoreCellData<T>(fullKey);
                return data?.value;
            },
            date() {
                const date = restoreCellData(fullKey)?.date;
                return date ? new Date(date) : undefined;
            },
            clear() {
                storeApi.remove(fullKey);
            },
        };
    }
    function keys() {
        return storeApi.keys().filter(key => key.startsWith(prefix));
    }
    return {
        cell: makeCell,
        cells() {
            return keys().map(makeCell);
        },
        sub(p: string) {
            return createStorage(`${prefix}/${p}`);
        },
    };
}
