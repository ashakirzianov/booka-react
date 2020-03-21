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

export function actionShadow(color: Color) {
    return `2px 2px 2px ${color}`;
}

export function panelShadow(color: Color) {
    return `0px 0px 2px ${color}`;
}

// export function roundShadow(color: Color) {
//     return `0px 0px 5px 0px ${color}`;
// }

export function roundShadow(color: Color) {
    return `2px 2px 2px ${color}`;
}

export const userAreaWidth = point(50);
export const buttonHeight = point(3);
export const buttonMargin = point(0.5);
