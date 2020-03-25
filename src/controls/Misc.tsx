import React from 'react';
import {
    View as NativeView,
    TouchableWithoutFeedback as NativeTouchableWithoutFeedback,
} from 'react-native';
import { Themed } from './theme';
import { percent, HasChildren } from './common';
import { colors } from '../core';

export const View = NativeView;
export const TouchableWithoutFeedback = NativeTouchableWithoutFeedback;

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}

export function Screen({ children, theme }: HasChildren & Themed) {
    return <View style={{
        backgroundColor: colors(theme).secondary,
        minHeight: '100vh',
    }}>
        {children}
    </View>;
}
