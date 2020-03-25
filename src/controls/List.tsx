// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { HasChildren } from './common';
import { Themed, colors, getFontSize } from './theme';

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
    }}>
        {children}
    </div>;
}

export function MenuListItem({ theme, left, right }: Themed & {
    left?: string,
    right?: string,
}) {
    return <div css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: colors(theme).text,
        fontSize: getFontSize(theme, 'small'),
        fontFamily: theme.fontFamilies.menu,
        '&:hover': {
            color: colors(theme).primary,
            background: colors(theme).highlight,
        },
    }}>
        <span>
            {left}
        </span>
        <span>
            {right}
        </span>
    </div>;
}
