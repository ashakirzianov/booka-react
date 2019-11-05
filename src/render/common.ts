import {
    BookRange, rangeToString,
} from 'booka-common';
import { config } from '../config';

export function generateQuoteLink(id: string, quote: BookRange) {
    return `${config().frontUrl}/book/${id}?q=${rangeToString(quote)}`;
}

export function pageForPosition(position: number): number {
    return Math.floor(position / 1500) + 1;
}
