import { of, concat, from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    Book, BookPath, fragmentForPath, findReference,
    defaultFragmentLength, tocForBook, firstPath, pathToString,
    AuthToken, AugmentedBookFragment, previewForPath,
} from 'booka-common';
import { libFetcher } from '../utils';
import { createBookStore } from './bookStore';

const lib = libFetcher();

export function booksProvider({ token }: {
    token?: AuthToken,
}) {
    const bookStore = createBookStore();
    function withCached<T>(bookId: string, proj: (c: Book | undefined) => Observable<T>): Observable<T> {
        return from(bookStore.existing(bookId)).pipe(
            mergeMap(proj),
        );
    }
    function getFragmentForPath(bookId: string, path: BookPath) {
        return withCached(bookId, book => {
            if (book) {
                const fragment = resolveFragment(book, path);
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
        });
    }

    return {
        fragmentForPath: getFragmentForPath,
        fragmentForRef(bookId: string, refId: string) {
            return withCached(bookId, cached => {
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
            });
        },
        textPreview(bookId: string, path: BookPath) {
            return withCached(bookId, cached => {
                if (cached) {
                    const preview = previewForPath(cached, path);
                    return of(preview);
                } else {
                    return lib.get('/preview', {
                        query: { id: bookId, node: path.node },
                    }).pipe(
                        map(r => r.preview),
                    );
                }
            });
        },
        tableOfContents(bookId: string) {
            return withCached(bookId, cached => {
                if (cached) {
                    const toc = tocForBook(cached);
                    return of(toc);
                } else {
                    return lib.get('/toc', {
                        query: { id: bookId },
                    });
                }
            });
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
