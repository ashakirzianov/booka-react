// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    Themed, colors, getFontSize, getFontFamily, FontFamilies,
} from '../application/theme';
import { point, WithChildren } from './common';
import { IconName, Icon } from './Icons';

export type LinkProps = Themed & {
    to: string,
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

export type StretchTextLinkProps = WithChildren<LinkProps>;
export function StretchTextLink({
    theme, to, children,
}: StretchTextLinkProps) {
    return <Link
        to={to}
        css={{
            textDecoration: 'none',
            alignSelf: 'stretch',
            flexGrow: 1,
            color: colors(theme).accent,
            borderColor: colors(theme).accent,
            '&:hover': {
                color: colors(theme).highlight,
                borderColor: colors(theme).highlight,
            },
        }}
    >
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            {children}
        </View>
    </Link>;
}
