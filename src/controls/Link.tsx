import React, { MouseEvent } from 'react';
import { HasChildren } from './common';

export function Link({ to, callback, children }: HasChildren & {
    to: string,
    callback: () => void,
}) {
    return <a
        href={to}
        style={{
            textDecoration: 'none',
            color: 'inherit',
        }}
        onClick={event => {
            if (!isKeyModified(event)) {
                event.preventDefault();
                event.stopPropagation();
                callback();
            }
        }}
    >
        {children}
    </a>;
}

function isKeyModified(event: MouseEvent) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
        ? true : false;
}
