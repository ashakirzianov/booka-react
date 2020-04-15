import { PropsWithChildren, CSSProperties } from 'react';
import { Interpolation } from '@emotion/core';
import { Color, colors, Theme } from './theme';
import { HighlightGroup, assertNever } from 'booka-common';
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
        case 'sixth':
            return 'pink';
        default:
            assertNever(group);
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

export function roundShadow(color: Color) {
    return `2px 2px 2px ${color}`;
}

export const radius = 3;

export const userAreaWidth = point(40);
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

export function panelShadow(color: string) {
    return {
        boxShadow: `0px 4px 6px -4px ${color}`,
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

export function pageEffect(shadow: string) {
    return {
        position: 'relative',
        boxShadow: `0 1px 4px ${shadow}, 0 0 6px rgba(0, 0, 0, 0.1) inset`,
        '&:after': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            boxShadow: `0 0 20px ${shadow}`,
            top: 0,
            bottom: 0,
            left: 10,
            right: 10,
            borderRadius: '50px',
            transform: 'auto',
        },
        '&:hover': {
            '&:before': {
                content: '""',
                zIndex: -1,
                position: 'absolute',
                top: '30%',
                bottom: 15,
                left: '30%',
                right: 15,
                boxShadow: `0px 0px 10px 10px ${shadow}`,
                transform: 'skew(3deg, 3deg)',
                borderRadius: 0,
            },
        },
    } as const;
}
