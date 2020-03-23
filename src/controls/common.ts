import { PropsWithChildren } from 'react';
import { Interpolation } from '@emotion/core';
import { Color } from './theme';
import { colors, Theme } from '../application';

export type HasChildren = PropsWithChildren<{}>;
export type Style = Interpolation;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return `${size}em`;
}

export function actionBack(theme: Theme) {
    return colors(theme).primary;
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

export const semiTransparent = 'rgba(0, 0, 0, 0.3)';
export const userAreaWidth = point(50);
export const buttonHeight = 50;
export const buttonWidth = 150;
export const normalMargin = point(0.5);
export const halfMargin = point(0.5);
export const nanoMargin = point(0.1);
export const doubleMargin = point(1);
export const normalPadding = point(0.5);
export const doublePadding = point(1);
export const halfPadding = point(0.25);
