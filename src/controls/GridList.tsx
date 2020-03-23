import React from 'react';
import { HasChildren } from './common';
import { Themed } from './theme';

export function GridList({ theme, children }: Themed & HasChildren) {
    return <div style={{
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        flexFlow: 'row nowrap',
        overflow: 'scroll',
        justifyContent: 'space-between',
    }}>
        {children}
    </div>;
}
