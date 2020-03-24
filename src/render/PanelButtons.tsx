import React from 'react';

import { Themed } from '../core';
import { TagButton, IconLink } from '../atoms';
import { ShowTocLink } from './Navigation';

export function LibButton({ theme }: Themed) {
    return <IconLink
        theme={theme}
        icon='left'
        to='/'
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
