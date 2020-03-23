import React from 'react';
import { View as NativeView } from 'react-native';
import { percent } from './common';

export const View = NativeView;

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}
