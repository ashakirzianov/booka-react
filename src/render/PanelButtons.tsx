import React from 'react';

import { Themed } from '../core';
import { useUrlActions } from '../application';
import { TagButton } from '../atoms';
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

export function TocButton({ theme, total, current }: Themed & {
    current: number,
    total: number | undefined,
}) {
    return <ShowTocLink toShow={true}>
        <TagButton
            theme={theme}
            text={
                total !== undefined
                    ? `${current} of ${total}`
                    : `${current}`
            }
        />
    </ShowTocLink>;
}
