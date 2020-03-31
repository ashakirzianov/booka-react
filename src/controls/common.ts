import { PropsWithChildren, CSSProperties } from 'react';
import { Interpolation } from '@emotion/core';
import { Color, colors, Theme } from './theme';
import { HighlightGroup } from 'booka-common';
import { PaletteColor, FontSizes, FontFamilies } from '../core';

export function colorForHighlightGroup(group: HighlightGroup): PaletteColor {
    switch (group) {
        case 'first':
            return 'yellow';
        case 'second':
            return 'violet';
        case 'third':
            return 'green';
        case 'forth':
            return 'red';
        case 'fifth':
            return 'blue';
        default:
            return 'neutral';
    }
}

export type HasChildren = PropsWithChildren<{}>;
export type Marginable = {
    margin?: Size,
    marginLeft?: Size,
    marginRight?: Size,
    marginTop?: Size,
    marginBottom?: Size,
};
export function margins({ margin, marginLeft, marginRight, marginTop, marginBottom }: Marginable, def?: Size) {
    return {
        marginLeft: marginLeft ?? margin ?? def,
        marginRight: marginRight ?? margin ?? def,
        marginTop: marginTop ?? margin ?? def,
        marginBottom: marginBottom ?? margin ?? def,
    };
}
export type Style = Interpolation;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return `${size}rem`;
}

export function actionBack(theme: Theme) {
    return colors(theme).primary;
}

export function panelShadow(color: Color) {
    return `0px 0px 2px ${color}`;
}

export function roundShadow(color: Color) {
    return `2px 2px 2px ${color}`;
}

export const radius = 3;

export const userAreaWidth = point(50);
export const panelHeight = point(14);
export const buttonHeight = 50;
export const buttonWidth = 120;
export const smallButtonHeight = 24;
export const menuWidth = point(15);

export const xsmallSpace = point(0.1);
export const smallSpace = point(0.25);
export const regularSpace = point(0.5);
export const doubleSpace = point(1);
export const megaSpace = point(3);

export const bookCoverHeight = 180;
export const bookCoverWidth = 120;

export const buttonStyle: CSSProperties = {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#00000000',
    margin: 0,
    padding: 0,
};

export function fontCss({
    theme, fontSize, fontFamily, bold, italic,
}: {
    theme: Theme,
    fontSize?: keyof FontSizes,
    fontFamily?: keyof FontFamilies,
    bold?: boolean,
    italic?: boolean,
}) {
    return {
        fontSize: theme.fontSizes[fontSize ?? 'normal'],
        fontFamily: theme.fontFamilies[fontFamily ?? 'menu'],
        fontWeight: bold ? 900 : 300,
        fontStyle: italic
            ? 'italic' as 'italic'
            : undefined,
    };
}

export function actionCss({ theme }: {
    theme: Theme,
}) {
    return {
        boxShadow: `2px 2px 2px ${colors(theme).shadow}`,
    };
}

export function actionHoverCss({ theme, color }: {
    theme: Theme,
    color?: PaletteColor,
}) {
    return {
        transform: 'translateY(-1px)',
        boxShadow: `3px 3px 3px ${colors(theme)[color ?? 'shadow']}`,
    };
}
