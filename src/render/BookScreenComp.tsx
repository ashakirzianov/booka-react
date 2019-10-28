import React from 'react';
import { assertNever } from 'booka-common';

import { AppState } from '../ducks';
import { useTheme } from '../core';
import { BookViewComp } from './BookViewComp';

export type BookScreenProps = {
    fragment: AppState['currentFragment'],
};
export function BookScreenComp({ fragment }: BookScreenProps) {
    const theme = useTheme();
    switch (fragment.state) {
        case 'no-fragment':
            return <span>No fragment set</span>;
        case 'loading':
            return <span>loading: {fragment.location.id}</span>;
        case 'ready':
            return <BookViewComp
                theme={theme}
                fragment={fragment.fragment}
            />;
        case 'error':
            return <span>error: {fragment.location.id}</span>;
        default:
            assertNever(fragment);
            return <span>Should not happen</span>;
    }
}
