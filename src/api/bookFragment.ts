import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import {
    BookFragment, BookPath, Book, fragmentForPath,
    defaultFragmentLength, tocForBook, LibContract,
    pathToString, findReference, firstPath, Highlight, BackContract, AuthToken,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { withPartial } from './operators';
import { BookLink } from '../core';

type OpenLinkResult = {
    fragment: BookFragment,
    link: BookLink,
    highlights: Highlight[],
};
export function openLink(bookLink: BookLink, auth?: AuthToken) {
    return openLinkFragment(bookLink).pipe(
        withLatestFrom(fetchHighlights(bookLink.bookId, auth)),
        map(([res, highlights]) => ({
            ...res,
            highlights,
        })),
    );
}

function openLinkFragment(bookLink: BookLink) {
    const observable = bookLink.refId !== undefined
        // Note: object assign to please TypeScript
        ? openRefId({ ...bookLink, refId: bookLink.refId })
        : openPath(bookLink);
    return observable;
}
type RefIdLink = BookLink & { refId: string };
function openRefId(link: RefIdLink): Observable<OpenLinkResult> {
    return getFragmentWithPathForId(link.bookId, link.refId).pipe(
        map(({ fragment, path }) => {
            return {
                fragment,
                link: {
                    ...link,
                    path,
                },
                highlights: [],
            };
        }),
    );
}

type PathLink = BookLink;
function openPath(link: PathLink): Observable<OpenLinkResult> {
    const path = link.path || (link.quote && link.quote.start) || firstPath();
    return getBookFragment(link.bookId, path).pipe(
        map((fragment) => {
            return {
                fragment,
                link: {
                    ...link,
                    path,
                },
                highlights: [],
            };
        }),
    );
}

function getBookFragment(bookId: string, path: BookPath): Observable<BookFragment> {
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

function getFragmentWithPathForId(
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

const libFetcher = createFetcher<LibContract>(config().libUrl);
function fetchBookFragment(id: string, path: BookPath) {
    return libFetcher.get('/fragment', {
        query: {
            id,
            path: pathToString(path),
        },
    });
}

function fetchBook(id: string) {
    return libFetcher.get('/full', {
        query: { id },
    });
}

// TODO: be consistent with fetch results
const backFetcher = createFetcher<BackContract>(config().backUrl);
function fetchHighlights(bookId: string, token?: AuthToken) {
    return token
        ? backFetcher.get('/highlights', {
            auth: token.token,
            query: {
                bookId,
            },
        }).pipe(
            map(res => res.value)
        )
        : of<Highlight[]>([]);
}
