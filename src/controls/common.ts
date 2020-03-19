import { PropsWithChildren } from 'react';

export type HasChildren = PropsWithChildren<{}>;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return `${size}em`;
}
