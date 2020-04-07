import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Book, BookPath, fragmentForPath, findReference,
    defaultFragmentLength, tocForBook, firstPath, pathToString,
    AuthToken, AugmentedBookFragment,
} from 'booka-common';
import { Cache } from '../../core';
import { libFetcher } from '../utils';

const lib = libFetcher();

export function booksProvider({ booksCache, token }: {
    booksCache: Cache<Book>,
    token?: AuthToken,
}) {
    function getFragmentForPath(bookId: string, path: BookPath) {
        const cached = booksCache.existing(bookId);
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
                    map(r => r.fragment),
                ),
                lib.get('/full', {
                    query: { id: bookId },
                }).pipe(
                    map(r => {
                        booksCache.add(bookId, r.book);
                        return resolveFragment(r.book, path);
                    }),
                ),
            );
        }
    }

    return {
        fragmentForPath: getFragmentForPath,
        fragmentForRef(bookId: string, refId: string) {
            const cached = booksCache.existing(bookId);
            if (cached) {
                const fragment = resolveRefId(cached, refId);
                return of(fragment);
            } else {
                return lib.get('/full', {
                    query: { id: bookId },
                }).pipe(
                    map(({ book }) => {
                        booksCache.add(bookId, book);
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

function resolveFragment(book: Book, path: BookPath): AugmentedBookFragment {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        ...fragment,
        images: book.images,
        toc: tocForBook(book),
    };
}
