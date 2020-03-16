import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Book, BookPath, fragmentForPath, LibraryCard,
    findReference, BookFragment, defaultFragmentLength, tocForBook, firstPath,
} from 'booka-common';
import { Api } from './api';
import { Storage } from './storage';

export function libraryProvider(api: Api, storage: Storage) {
    const bookCache = cache<Book>(storage.sub('books'));
    const cardCache = cache<LibraryCard>(storage.sub('cards'));

    return {
        fragmentForPath(bookId: string, path: BookPath) {
            const cached = bookCache.existing(bookId);
            if (cached) {
                const fragment = resolveFragment(cached, path);
                return of(fragment);
            } else {
                return concat(
                    api.getFragment(bookId, path),
                    api.getBook(bookId).pipe(
                        map(book => {
                            bookCache.add(bookId, book);;
                            return resolveFragment(book, path);
                        })
                    ),
                );
            }
        },
        fragmentForRef(bookId: string, refId: string) {
            const cached = bookCache.existing(bookId);
            if (cached) {
                const fragment = resolveRefId(cached, refId);
                return of(fragment);
            } else {
                return api.getBook(bookId).pipe(
                    map(book => {
                        bookCache.add(bookId, book);
                        const fragment = resolveRefId(book, refId);
                        return fragment;
                    })
                );
            }
        },
        cardForId(bookId: string) {
            const cached = cardCache.existing(bookId);
            if (cached) {
                return of(cached);
            } else {
                return api.getLibraryCard(bookId).pipe(
                    map(card => {
                        cardCache.add(bookId, card);
                        return card;
                    })
                );
            }
        },
    };
}

// TODO: move to 'common' ?

function cache<T>(storage: Storage) {
    return {
        existing(key: string): T | undefined {
            return storage.cell<T>(key).restore();
        },
        add(key: string, data: T) {
            storage.cell<T>(key).store(data);
        },
    };
}

function resolveRefId(book: Book, refId: string) {
    const reference = findReference(book.nodes, refId);
    if (reference) {
        const path = reference[1];
        const fragment = resolveFragment(book, path);
        return fragment;
    } else {
        // TODO: handle properly
        return resolveFragment(book, firstPath());
    }
}

function resolveFragment(book: Book, path: BookPath): BookFragment {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        ...fragment,
        images: book.images,
        toc: tocForBook(book),
    };
}
