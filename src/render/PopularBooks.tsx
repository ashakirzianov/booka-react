import React from 'react';

import { usePopularBooks, useTheme } from '../application';
import { Panel, ActivityIndicator } from '../controls';
import { BookList } from './BookList';

export function PopularBooks() {
    const theme = useTheme();
    const popularBooksState = usePopularBooks();
    if (popularBooksState.loading) {
        return <ActivityIndicator theme={theme} />;
    } else if (popularBooksState.length === 0) {
        return null;
    }

    return <Panel
        theme={theme}
        title='Popular'
    >
        <BookList
            theme={theme}
            books={popularBooksState}
            lines={3}
        />
    </Panel>;
}
