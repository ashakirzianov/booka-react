import React from 'react';
import { Column, Row } from './Layout';
import { HasChildren } from './common';

export function GridList({ children }: HasChildren) {
    return <Column>
        <Row
            maxWidth='100%'
            centered
        >
            {children}
        </Row>
    </Column>;
}
