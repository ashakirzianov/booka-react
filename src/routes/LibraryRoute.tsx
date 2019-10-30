import React from 'react';

import { LibraryScreenComp } from '../render';
import { useAppDispatch } from '../core';
import { RouteProps } from '../atoms';

export function LibraryRoute(_: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch({ type: 'library-open' });
    }, [dispatch]);

    return <LibraryScreenComp />;
}
