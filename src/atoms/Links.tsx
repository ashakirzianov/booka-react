import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors, getFontSize } from './theme';
import { Link } from './Router';
// import { Callback } from './common';

export type LinkProps = Themed & {
    to: string,
    // onClick?: Callback,
};

export type TextLinkProps = LinkProps & {
    text: string,
};
export function TextLink({
    to, text, theme,
}: TextLinkProps) {
    return <Link
        to={to}
        css={{
            textDecoration: 'none',
            color: colors(theme).accent,
            fontSize: getFontSize(theme, 'normal'),
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
    >
        {text}
    </Link>;
}
