import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Book, BookPath, fragmentForPath, findReference,
    defaultFragmentLength, tocForBook, firstPath, pathToString,
    AuthToken, AugmentedBookFragment,
} from 'booka-common';
import { libFetcher } from '../utils';
import { BookStore } from './bookStore';

const lib = libFetcher();

export function booksProvider({ bookStore, token }: {
    bookStore: BookStore,
    token?: AuthToken,
}) {
    function getFragmentForPath(bookId: string, path: BookPath) {
        const cached = bookStore.existing(bookId);
        if (cached) {
            const fragment = resolveFragment(cached, path);
            return of(fragment);
        } else {
            return concat(
                lib.get('/fragment', {
                    auth: token?.token,
                    query: {
                        id: bookId,
                        path: pathToString(path),
                    },
                }).pipe(
                    map(({ fragment }) => ({ fragment, path })),
                ),
                lib.get('/full', {
                    query: { id: bookId },
                }).pipe(
                    map(r => {
                        bookStore.add(bookId, r.book);
                        return resolveFragment(r.book, path);
                    }),
                ),
            );
        }
    }

    return {
        fragmentForPath: getFragmentForPath,
        fragmentForRef(bookId: string, refId: string) {
            const cached = bookStore.existing(bookId);
            if (cached) {
                const fragment = resolveRefId(cached, refId);
                return of(fragment);
            } else {
                return lib.get('/full', {
                    query: { id: bookId },
                }).pipe(
                    map(({ book }) => {
                        bookStore.add(bookId, book);
                        const fragment = resolveRefId(book, refId);
                        return fragment;
                    }),
                );
            }
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

type FragmentWithPath = {
    fragment: AugmentedBookFragment,
    path: BookPath,
};
function resolveFragment(book: Book, path: BookPath): FragmentWithPath {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        fragment: {
            ...fragment,
            images: book.images,
            toc: tocForBook(book),
        },
        path,
    };
}
