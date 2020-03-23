import React from 'react';
import { View as NativeView } from 'react-native';
import { percent, halfMargin } from './common';

export const View = NativeView;

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}

export function ButtonSeparator() {
    return <View style={{
        width: halfMargin,
    }} />;
}
