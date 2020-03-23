import React from 'react';
import { HasChildren } from './common';

export function GridList({ children }: HasChildren) {
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
