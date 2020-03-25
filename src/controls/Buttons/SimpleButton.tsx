import React from 'react';
import { HasChildren } from '../common';

export function SimpleButton({ children, onClick }: HasChildren & {
    onClick: () => void,
}) {
    return <button
        style={{
            borderWidth: 0,
            background: 'rgba(0,0,0,0)',
        }}
        onClick={onClick}
    >
        {children}
    </button >;
}
