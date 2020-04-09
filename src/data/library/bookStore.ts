import { Book } from 'booka-common';
import { AsyncStorage, createAsyncStorage } from '../../core';

export type BookStore = ReturnType<typeof createBookStore>;
export function createBookStore() {
    return createBookStoreImpl(
        createAsyncStorage<BookCell>('<book>'),
    );
}

type BookCell = {
    book: Book,
    date: number,
};
function createBookStoreImpl(storage: AsyncStorage<BookCell>) {
    const inMemory: {
        [bookId: string]: Book | undefined;
    } = {};
    return {
        async add(bookId: string, book: Book) {
            inMemory[bookId] = book;
            const cell: BookCell = {
                book,
                date: Date.now(),
            };
            let success = await storage.store(cell, bookId);
            if (!success) {
                let items = await storage.items();
                while (!success && items.length > 0) {
                    const [key] = items.reduce(
                        (o, c) => o[1].date > c[1].date
                            ? c : o,
                    );
                    await storage.clear(key);
                    items = items.filter(([k]) => k !== key);
                    success = await storage.store(cell, bookId);
                }
            }
            return success;
        },
        async existing(bookId: string): Promise<Book | undefined> {
            return inMemory[bookId] || (await storage.restore(bookId))?.book;
        },
    };
}
