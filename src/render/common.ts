import {
    BookPositionLocator, pathToString, BookRange, rangeToString,
} from 'booka-common';
import { config } from '../config';

export function linkForLocation(location: BookPositionLocator): string {
    return `/book/${location.id}?p=${pathToString(location.path)}`;
}

export function generateQuoteLink(id: string, quote: BookRange) {
    return `${config().frontUrl}/book/${id}?q=${rangeToString(quote)}`;
}
