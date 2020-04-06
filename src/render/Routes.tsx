import React from 'react';
import { assertNever } from 'booka-common';
import { useAppLocation } from '../application';
import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';

export function Routes() {
    const location = useAppLocation();
    switch (location.location) {
        case 'feed':
            return <FeedScreen location={location} />;
        case 'book':
            return <BookScreen location={location} />;
        default:
            assertNever(location);
            return <FeedScreen location={{ location: 'feed' }} />;
    }
}
