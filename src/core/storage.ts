import storeApi from 'store2';

export type StorageCell<T> = {
    store: (value: T) => boolean,
    restore: () => T | undefined,
    date: () => Date | undefined,
    clear: () => void,
};
export type AppStorage = ReturnType<typeof createStorage>;
export function createStorage(prefix: string) {
    function makeCell<T>(fullKey: string): StorageCell<T> {
        let inMemory: CellData | undefined;
        type CellData = {
            value: T,
            date: number,
        };
        function restoreCellData(): CellData | undefined {
            return inMemory ?? storeApi.get(fullKey);
        }
        return {
            store(value) {
                try {
                    const data: CellData = {
                        value, date: Date.now(),
                    };
                    storeApi.set(fullKey, data);
                    inMemory = data;
                    return true;
                } catch {
                    return false;
                }
            },
            restore() {
                const data = restoreCellData();
                return data?.value;
            },
            date() {
                const date = restoreCellData()?.date;
                return date ? new Date(date) : undefined;
            },
            clear() {
                storeApi.remove(fullKey);
                inMemory = undefined;
            },
        };
    }
    function keys() {
        return storeApi.keys().filter(key => key.startsWith(`${prefix}:`));
    }
    return {
        cell<T>(key: string) {
            const fullKey = `${prefix}:${key}`;
            return makeCell<T>(fullKey);
        },
        cells() {
            return keys().map(makeCell);
        },
        sub(p: string) {
            return createStorage(`${prefix}/${p}`);
        },
    };
}
