import React from 'react';
import { Themed } from '../application';

export function ActionButton({
    text, onClick,
}: Themed & {
    text: string,
    onClick: () => void,
}) {
    return <input
        type='button'
        value={text}
        onClick={onClick}
    />;
}
