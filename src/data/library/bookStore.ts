import { Book } from 'booka-common';
import { AppStorage, createStorage } from '../../core';

export type BookStore = ReturnType<typeof createBookStore>;
export function createBookStore() {
    return createBookStoreImpl(createStorage('<book>'));
}

function createBookStoreImpl(storage: AppStorage) {
    const inMemory: {
        [bookId: string]: Book | undefined;
    } = {};
    return {
        add(bookId: string, book: Book) {
            inMemory[bookId] = book;
            const newCell = storage.cell<Book>(bookId);
            let success = newCell.store(book);
            while (!success) {
                const cells = storage.cells();
                if (cells.length === 0) {
                    break;
                }
                const oldestCell = cells.reduce(
                    (oldest, curr) => {
                        const oldestDate = oldest.date();
                        if (!oldestDate) {
                            return curr;
                        }
                        const currDate = curr.date();
                        return !currDate
                            ? oldest
                            : currDate < oldestDate ? curr : oldest;
                    },
                );
                oldestCell.clear();
                success = newCell.store(book);
            }
            return success;
        },
        existing(bookId: string): Book | undefined {
            return inMemory[bookId] || storage.cell<Book>(bookId).restore();
        },
    };
}
