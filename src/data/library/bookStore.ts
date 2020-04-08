import { Book } from 'booka-common';
import { SyncStorage, createSyncStorage } from '../../core';

export type BookStore = ReturnType<typeof createBookStore>;
export function createBookStore() {
    return createBookStoreImpl(createSyncStorage<Book>('<book>'));
}

function createBookStoreImpl(storage: SyncStorage) {
    const inMemory: {
        [bookId: string]: Book | undefined;
    } = {};
    return {
        add(bookId: string, book: Book) {
            inMemory[bookId] = book;
            let success = storage.store(book, bookId);
            while (!success) {
                const keys = storage.keys();
                if (keys.length === 0) {
                    break;
                } else {
                    storage.clear(keys[0]);
                    success = storage.store(book, bookId);
                }
            }
            return success;
        },
        existing(bookId: string): Book | undefined {
            return inMemory[bookId] || storage.restore(bookId);
        },
    };
}
