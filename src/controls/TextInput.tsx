// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, getFontSize, colors } from './theme';
import {
    actionShadow, buttonHeight, actionBack, normalPadding, normalMargin,
} from './common';

export function TextInput({
    theme, initial, onChange, placeholder,
}: Themed & {
    placeholder?: string,
    initial?: string,
    onChange: (text: string) => void,
}) {
    return <View style={{
        flexBasis: 1,
        flexGrow: 1,
        margin: normalMargin,
    }}>
        <input
            css={{
                paddingTop: 0, paddingBottom: 0,
                paddingLeft: normalPadding, paddingRight: normalPadding,
                borderWidth: 0,
                height: buttonHeight,
                color: colors(theme).text,
                fontSize: getFontSize(theme, 'xlarge'),
                boxShadow: actionShadow(colors(theme).shadow),
                backgroundColor: actionBack(theme),
                '&::placeholder': {
                    color: colors(theme).accent,
                    fontSize: getFontSize(theme, 'normal'),
                    fontStyle: 'italic',
                    fontWeight: 100,
                },
                '&:focus::placeholder': {
                    color: colors(theme).highlight,
                },
                '&:focus': {
                    outline: 'none',
                    color: colors(theme).highlight,
                    boxShadow: actionShadow(colors(theme).highlight),
                },
            }}
            placeholder={placeholder}
            defaultValue={initial}
            type='text'
            onChange={event => {
                onChange(event.target.value);
            }}
        />
    </View>;
}
