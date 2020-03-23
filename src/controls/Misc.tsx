import React from 'react';
import { View as NativeView } from 'react-native';
import { percent, HasChildren } from './common';

export const View = NativeView;

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}

export function Screen({ children }: HasChildren) {
    return <View style={{
        minHeight: '100vh',
    }}>
        {children}
    </View>;
}
