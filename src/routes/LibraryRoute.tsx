import React from 'react';

import { LibraryScreen } from '../render';
import { useAppDispatch } from '../application';
import { RouteProps } from '../atoms';

export function LibraryRoute(_: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch({ type: 'library-open' });
    }, [dispatch]);

    return <LibraryScreen />;
}
