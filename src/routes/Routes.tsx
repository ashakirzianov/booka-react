import React from 'react';
import { Router } from '../atoms';
import { LibraryRoute } from './LibraryRoute';
import { BookRoute } from './BookRoute';

export function Routes() {
    return <Router>
        <LibraryRoute path='/' />
        <BookRoute path='/book/:bookId' />
    </Router>;
}
