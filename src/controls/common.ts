import { PropsWithChildren } from 'react';
import { Color } from '../application';
import { Interpolation } from '@emotion/core';

export type HasChildren = PropsWithChildren<{}>;
export type Style = Interpolation;

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

export const userAreaWidth = point(50);
