import { Observable } from 'rxjs';
import {
    BookFragment, BookPath, ImageDic,
    TableOfContents, Book, fragmentForPath,
    defaultFragmentLength, tocForBook,
} from 'booka-common';
import { fetchBookFragment, fetchBook } from './lib';

export type BookData = {
    id: string,
    path: BookPath,
    fragment: BookFragment,
    images?: ImageDic,
    toc?: TableOfContents,
};

const cache: {
    [id: string]: Book,
} = {};
export function getBookData(id: string, path: BookPath): Observable<BookData> {
    return new Observable(subs => {
        const cached = cache[id];
        if (cached) {
            subs.next(bookDataForBook(id, path, cached));
            subs.complete();
            return;
        }
        // TODO: forward errors
        const fragmentSubscription = fetchBookFragment(id, path).subscribe(res => {
            subs.next({ id, path, fragment: res.value });
        });
        const bookSubscription = fetchBook(id).subscribe(res => {
            fragmentSubscription.unsubscribe();
            const book = res.value;
            cache[id] = book;
            subs.next(bookDataForBook(id, path, book));
            subs.complete();
        });
    });
}

function bookDataForBook(id: string, path: BookPath, book: Book): BookData {
    const fragment = fragmentForPath(book, path, defaultFragmentLength);
    const toc = tocForBook(book);
    return {
        id, path, fragment, toc,
        images: book.images,
    };
}
