import React from 'react';
import { assertNever } from 'booka-common';
import { useAppLocation } from '../application';
import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';

export function Routes() {
    const location = useAppLocation();
    switch (location) {
        case 'feed':
            return <FeedScreen />;
        case 'book':
            return <BookScreen />;
        default:
            assertNever(location);
            return <FeedScreen />;
    }
}
