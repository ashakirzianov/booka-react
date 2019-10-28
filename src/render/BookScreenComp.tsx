import React from 'react';
import { BookPositionLocator } from 'booka-common';
import { BookFragmentState } from '../ducks/bookFragment';
import { assertNever } from '../reader/RichText/utils';

export type BookScreenProps = {
    fragment: BookFragmentState,
};
export function BookScreenComp({ fragment }: BookScreenProps) {
    switch (fragment.state) {
        case 'no-fragment':
            return <span>No fragment set</span>;
        case 'loading':
            return <span>loading: {fragment.location.id}</span>;
        case 'ready':
            return <span>ready: {fragment.fragment.current.join('-')}</span>;
        default:
            assertNever(fragment);
            return <span>Should not happen</span>;
    }
}
