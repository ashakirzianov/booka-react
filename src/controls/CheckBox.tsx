import React from 'react';

import { Themed } from '../core';
import { fontCss, normalMargin } from './common';

export function CheckBox({
    checked, text, onChange, theme,
}: Themed & {
    checked: boolean,
    text?: string,
    onChange?: () => void,
}) {
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }}>
        <input
            type='checkbox'
            checked={checked}
            onChange={onChange}
            style={{
                border: 'none',
                transform: 'scale(1.5)',
            }}
        />
        <span style={{
            ...fontCss({ theme, fontSize: 'small' }),
            marginLeft: normalMargin,
        }}>
            {text}
        </span>
    </div>;
}
