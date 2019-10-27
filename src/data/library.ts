import { ajax } from 'rxjs/ajax';
import { BookDesc, Page } from 'booka-common';

import { config } from '../config';

export function fetchAllBooks(page: number) {
    const url = `${config().libUrl}/all?page=${page}`;
    return ajax.getJSON<Page<BookDesc>>(url);
}