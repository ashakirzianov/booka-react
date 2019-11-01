import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    BookFragment, BookPath, Book, fragmentForPath,
    defaultFragmentLength, tocForBook, LibContract,
    pathToString, findReference,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { withPartial } from './operators';

export function getBookFragment(bookId: string, path: BookPath): Observable<BookFragment> {
    return withPartial(
        getBookCached(bookId).pipe(
            map(book => {
                return resolveFragment(book, path);
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
    return getBookCached(bookId).pipe(
        map(book => {
            const pair = resolveRefId(book, refId);
            if (pair) {
                return pair;
            } else {
                throw new Error(`Could not resolve an id: ${refId}`);
            }
        }),
    );
}

type FragmentWithPath = {
    fragment: BookFragment,
    path: BookPath,
};
function resolveRefId(book: Book, refId: string): FragmentWithPath | undefined {
    const reference = findReference(book.nodes, refId);
    if (reference) {
        const path = reference[1];
        const fragment = resolveFragment(book, path);
        return { fragment, path };
    } else {
        return undefined;
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

const cache: {
    [id: string]: Book,
} = {};
function getBookCached(id: string): Observable<Book> {
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
