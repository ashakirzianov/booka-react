import { of } from 'rxjs';
import { BookSearchResult } from 'booka-common';
import { Api } from './api';

export function searchProvider(api: Api) {
    return {
        querySearch(query: string | undefined) {
            if (!query) {
                return of<BookSearchResult[]>([]);
            } else {
                return api.getSearchResults(query);
            }
        },
    };
}
