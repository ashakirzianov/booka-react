// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from './theme';
import {
    regularSpace, fontCss, radius, point,
} from './common';

export function SearchInput({
    theme, initial, onChange, placeholder,
}: Themed & {
    placeholder?: string,
    initial?: string,
    onChange: (text: string) => void,
}) {
    return <View style={{
        flexBasis: 1,
        flexGrow: 1,
        margin: regularSpace,
        alignItems: 'center',
    }}>
        <input
            css={{
                paddingTop: 0, paddingBottom: 0,
                paddingLeft: regularSpace, paddingRight: regularSpace,
                maxWidth: point(30),
                borderWidth: 1,
                borderRadius: radius,
                borderColor: colors(theme).accent,
                borderStyle: 'solid',
                color: colors(theme).text,
                ...fontCss({ theme, fontSize: 'xlarge' }),
                backgroundColor: colors(theme).primary,
                '&:hover': {
                    borderColor: colors(theme).highlight,
                },
                '&::placeholder': {
                    color: colors(theme).accent,
                    ...fontCss({ theme, italic: true }),
                    fontWeight: 100,
                },
                '&:focus::placeholder': {
                    color: colors(theme).highlight,
                },
                '&:focus': {
                    outline: 'none',
                    color: colors(theme).highlight,
                    borderColor: colors(theme).highlight,
                    boxShadow: `0px 0px 2px ${colors(theme).highlight}`,
                },
            }}
            placeholder={placeholder}
            defaultValue={initial}
            type='search'
            onChange={event => {
                onChange(event.target.value);
            }}
        />
    </View>;
}
