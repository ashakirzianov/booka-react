import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    BookFragment, BookPath, Book, fragmentForPath,
    defaultFragmentLength, tocForBook, LibContract, pathToString, findReference,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { withPartial } from './operators';

export function getBookFragment(bookId: string, path: BookPath): Observable<BookFragment> {
    return withPartial(
        getBook(bookId).pipe(
            map(book => {
                return resolvedFragment(book, path);
            })
        ),
        fetchBookFragment(bookId, path).pipe(
            map(res => {
                return res.value;
            })
        ),
    );
}

export function getFragmentWithPathForId(
    bookId: string, refId: string,
): Observable<FragmentWithPath> {
    return new Observable(subs => {
        const cached = cache[bookId];
        if (cached) {
            const pair = resolveRefId(cached, refId);
            if (pair) {
                subs.next(pair);
                subs.complete();
            } else {
                subs.error({
                    diag: 'bad reference',
                    refId,
                });
            }
            return;
        } else {
            const bookSubscription = fetchBook(bookId).subscribe(res => {
                const book = res.value;
                cache[bookId] = book;
                const pair = resolveRefId(book, refId);
                if (pair) {
                    subs.next(pair);
                    subs.complete();
                } else {
                    subs.error({
                        diag: 'bad reference',
                        refId,
                    });
                }
            });
            return {
                unsubscribe() {
                    bookSubscription.unsubscribe();
                },
            };
        }
    });
}

type FragmentWithPath = {
    fragment: BookFragment,
    path: BookPath,
};
function resolveRefId(book: Book, refId: string): FragmentWithPath | undefined {
    const reference = findReference(book.nodes, refId);
    if (reference) {
        const path = reference[1];
        const fragment = resolvedFragment(book, path);
        return { fragment, path };
    } else {
        return undefined;
    }
}

function resolvedFragment(book: Book, path: BookPath): BookFragment {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        ...fragment,
        images: book.images,
        toc: tocForBook(book),
    };
}

const cache: {
    [id: string]: Book,
} = {};
function getBook(id: string): Observable<Book> {
    const cached = cache[id];
    if (cached) {
        return of(cached);
    } else {
        return fetchBook(id).pipe(
            map(({ value: book }) => {
                cache[id] = book;
                return book;
            })
        );
    }
}

const fetcher = createFetcher<LibContract>(config().libUrl);
function fetchBookFragment(id: string, path: BookPath) {
    return fetcher.get('/fragment', {
        query: {
            id,
            path: pathToString(path),
        },
    });
}

function fetchBook(id: string) {
    return fetcher.get('/full', {
        query: { id },
    });
}
