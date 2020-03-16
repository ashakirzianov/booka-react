import { Api } from './api';

export function cardsProvider(api: Api) {
    return {
        libraryCardForId(bookId: string) {
            return api.getLibraryCard(bookId);
        },
    };
}
