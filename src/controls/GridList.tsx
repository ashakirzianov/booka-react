import React from 'react';
import { HasChildren } from './common';

export function GridList({ children }: HasChildren) {
    return <div style={{
        display: 'flex',
        flexGrow: 1,
        flexFlow: 'row wrap',
        justifyContent: 'space-around',
    }}>
        {children}
    </div>;
}
