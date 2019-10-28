import React from 'react';
import { assertNever } from 'booka-common';

import { AppState } from '../ducks';

export type BookScreenProps = {
    fragment: AppState['currentFragment'],
};
export function BookScreenComp({ fragment }: BookScreenProps) {
    switch (fragment.state) {
        case 'no-fragment':
            return <span>No fragment set</span>;
        case 'loading':
            return <span>loading: {fragment.location.id}</span>;
        case 'ready':
            return <span>ready: {fragment.fragment.current.join('-')}</span>;
        case 'error':
            return <span>error: {fragment.location.id}</span>;
        default:
            assertNever(fragment);
            return <span>Should not happen</span>;
    }
}
