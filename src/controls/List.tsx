// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    HasChildren, point, regularSpace, doubleSpace, fontCss,
} from './common';
import { Themed, colors } from './theme';

export function GridList({ theme, children }: Themed & HasChildren) {
    return <div style={{
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        flexFlow: 'row nowrap',
        overflow: 'scroll',
        justifyContent: 'flex-start',
    }}>
        {children}
    </div>;
}

export function MenuList({ theme, children }: Themed & HasChildren) {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
    }}>
        {children}
    </div>;
}

export function MenuListItem({ theme, left, right, ident }: Themed & {
    ident?: number,
    left?: string,
    right?: string,
}) {
    return <div css={{
        display: 'flex',
        flexDirection: 'column',
    }}>
        <div css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: regularSpace, paddingBottom: regularSpace,
            paddingLeft: doubleSpace, paddingRight: doubleSpace,
            color: colors(theme).text,
            ...fontCss({ theme, fontSize: 'xsmall' }),
            fontFamily: theme.fontFamilies.menu,
            '&:hover': {
                color: colors(theme).primary,
                background: colors(theme).highlight,
            },
        }}>
            <span style={{
                textIndent: ident
                    ? point(ident)
                    : undefined,
            }}>
                {left}
            </span>
            <span>
                {right}
            </span>
        </div>
        <hr css={{
            border: 'none',
            borderTop: `1px solid ${colors(theme).dimmed}`,
            width: '90%',
        }} />
    </div>;
}
