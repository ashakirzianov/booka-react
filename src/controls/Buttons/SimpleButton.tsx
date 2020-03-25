import React from 'react';
import { HasChildren } from '../common';

export function SimpleButton({ children, callback }: HasChildren & {
    callback: () => void,
}) {
    return <button
        style={{
            borderWidth: 0,
            background: 'rgba(0,0,0,0)',
        }}
        onClick={callback}
    >
        {children}
    </button >;
}
