import React from 'react';
import { HasChildren } from './common';
import { Themed } from '../application';
import { Column } from './Layout';

export function Panel({ children }: HasChildren & Themed) {
    return <Column>
        {children}
    </Column>;
}
