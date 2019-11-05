import React from 'react';

import { LibraryScreenComp } from '../render';
import { useAppDispatch, useTheme, useAppSelector } from '../core';
import { RouteProps } from '../atoms';

export function LibraryRoute(_: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch({ type: 'library-open' });
    }, [dispatch]);
    const theme = useTheme();
    const books = useAppSelector(s => s.library.books);

    return <LibraryScreenComp
        theme={theme}
        books={books}
    />;
}
