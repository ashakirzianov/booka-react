import React from 'react';
import { assertNever } from 'booka-common';

import { AppState } from '../ducks';
import { useTheme } from '../core';
import { BookViewComp } from './BookViewComp';
import { WithChildren, Column, EmptyLine, point, Row } from '../atoms';

export type BookScreenProps = {
    fragment: AppState['currentFragment'],
};
export function BookScreenComp(props: BookScreenProps) {
    return <BookScreenContainer>
        <BookScreenContent {...props} />
    </BookScreenContainer>;
}

function BookScreenContent({ fragment }: BookScreenProps) {
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

function BookScreenContainer({ children }: WithChildren<{}>) {
    return <Row fullWidth centered>
        <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
            <EmptyLine />
            {children}
            <EmptyLine />
        </Column>
    </Row>;
}
