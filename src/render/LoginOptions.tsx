import React from 'react';
import { Themed } from '../core';
import { FacebookLogin } from '../controls';

export function LoginOptions({ theme, onStatusChanged }: Themed & {
    onStatusChanged?: () => void,
}) {
    return <>
        <FacebookLogin
            theme={theme}
            onStatusChange={onStatusChanged}
        />
    </>;
}
