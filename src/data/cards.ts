import {
    LibContract, LibraryCard,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { map } from 'rxjs/operators';

const lib = createFetcher<LibContract>(config().backUrl);

export function libraryCard({ bookId }: {
    bookId: string,
}) {
    // TODO: use different api ?
    const observable = lib.post('/card/batch', {
        body: [{ id: bookId }],
    }).pipe(
        map(res => {
            const card = res.value[0]?.card;
            if (card) {
                return card;
            } else {
                throw new Error(`No book for id: ${bookId}`);
            }
        })
    );
    return { observable };
}
