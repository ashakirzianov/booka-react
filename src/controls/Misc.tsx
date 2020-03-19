import React from 'react';
import { percent } from './common';

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}
