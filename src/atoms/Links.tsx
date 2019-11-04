// import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    Themed, colors, getFontSize, getFontFamily, FontFamilies,
} from './theme';
import { Link } from './Router';
import { point } from './common';
import { IconName, Icon } from './Icons';
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

export type BorderLinkProps = LinkProps & {
    text: string,
    fontFamily: keyof FontFamilies,
};
export function BorderLink({
    to, text, theme, fontFamily,
}: BorderLinkProps) {
    return <Link
        to={to}
        css={{
            textDecoration: 'none',
            color: colors(theme).accent,
            fontFamily: getFontFamily(theme, fontFamily),
            fontSize: getFontSize(theme, 'normal'),
            borderStyle: 'solid',
            borderRadius: 10,
            padding: point(0.3),
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
    >
        {text}
    </Link>;
}

export type IconLinkProps = LinkProps & {
    icon: IconName,
};
export function IconLink({
    icon, theme, to,
}: IconLinkProps) {
    return <Link to={to}>
        <Icon
            theme={theme}
            name={icon}
            size={24}
            color='accent'
            hoverColor='highlight'
        />
    </Link>;
}
