import { Observable } from 'rxjs';
import {
    BookFragment, BookPath, Book, fragmentForPath,
    defaultFragmentLength, tocForBook,
} from 'booka-common';
import { fetchBookFragment, fetchBook } from './lib';

const cache: {
    [id: string]: Book,
} = {};
export function getBookFragment(id: string, path: BookPath): Observable<BookFragment> {
    return new Observable(subs => {
        const cached = cache[id];
        if (cached) {
            subs.next(resolvedFragment(id, path, cached));
            subs.complete();
            return;
        }
        // TODO: forward errors
        const fragmentSubscription = fetchBookFragment(id, path).subscribe(res => {
            subs.next(res.value);
        });
        const bookSubscription = fetchBook(id).subscribe(res => {
            fragmentSubscription.unsubscribe();
            const book = res.value;
            cache[id] = book;
            subs.next(resolvedFragment(id, path, book));
            subs.complete();
        });
    });
}

function resolvedFragment(id: string, path: BookPath, book: Book): BookFragment {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    return {
        ...fragment,
        images: book.images,
        toc: tocForBook(book),
    };
}
