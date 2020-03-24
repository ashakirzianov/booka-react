import React from 'react';

import { Themed } from '../core';
import { useUrlActions } from '../application';
import { IconButton } from '../controls';
import { ShowTocLink } from './Navigation';

export function BackButton({ theme }: Themed) {
    const { back } = useUrlActions();
    return <IconButton
        theme={theme}
        icon='left'
        onClick={back}
    />;
}

export function TocButton({ theme }: Themed) {
    return <ShowTocLink toShow={true}>
        <IconButton
            theme={theme}
            icon='items'
        />
    </ShowTocLink>;
}
