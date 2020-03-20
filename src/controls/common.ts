import { PropsWithChildren } from 'react';
import { Color } from '../application';

export type HasChildren = PropsWithChildren<{}>;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return `${size}em`;
}

export function boxShadow(color: Color) {
    return `2px 2px 2px ${color}`;
}
