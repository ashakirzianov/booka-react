import { Observable } from 'rxjs';
import {
    BookFragment, BookPath, Book, fragmentForPath,
    defaultFragmentLength, tocForBook, LibContract, pathToString,
} from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';

const cache: {
    [id: string]: Book,
} = {};
export function getBookFragment(id: string, path: BookPath): Observable<BookFragment> {
    return new Observable(subs => {
        const cached = cache[id];
        if (cached) {
            subs.next(resolvedFragment(path, cached));
            subs.complete();
            return;
        }
        // TODO: forward errors
        // TODO: implement as composition ?
        const fragmentSubscription = fetchBookFragment(id, path).subscribe(res => {
            subs.next(res.value);
        });
        const bookSubscription = fetchBook(id).subscribe(res => {
            fragmentSubscription.unsubscribe();
            const book = res.value;
            cache[id] = book;
            subs.next(resolvedFragment(path, book));
            subs.complete();
        });
        return {
            unsubscribe() {
                fragmentSubscription.unsubscribe();
                bookSubscription.unsubscribe();
            },
        };
    });
}

function resolvedFragment(path: BookPath, book: Book): BookFragment {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        ...fragment,
        images: book.images,
        toc: tocForBook(book),
    };
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
