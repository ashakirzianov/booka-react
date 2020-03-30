import React from 'react';

import { Themed } from '../core';
import { Label } from './Label';
import { actionCss } from './common';

export function Checkbox({
    checked, text, onChange, theme,
}: Themed & {
    checked: boolean,
    text?: string,
    onChange?: () => void,
}) {
    return <div>
        <input
            type='checkbox'
            checked={checked}
            onChange={onChange}
            style={{
                ...actionCss({ theme }),
            }}
        />
        {text && <Label
            theme={theme}
            text={text}
        />}
    </div>;
}
