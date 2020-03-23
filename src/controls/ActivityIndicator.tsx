import React from 'react';
import {
    ActivityIndicator as NativeActivityIndicator, View,
} from 'react-native';
import { Themed, colors } from '../application';

export function ActivityIndicator({ theme }: Themed) {
    return <NativeActivityIndicator
        color={colors(theme).text}
    />;
}

export function FullScreenActivityIndicator({ theme }: Themed) {
    return <View
        style={{
            position: 'fixed' as any,
            flexDirection: 'column',
            top: 0, left: 0,
            minHeight: '100%',
            minWidth: '100%',
            width: '100%',
            height: '100%',
            backgroundColor: colors(theme).semiTransparent,
            justifyContent: 'center',
            zIndex: 10,
        }}
    >
        <NativeActivityIndicator
            size='large'
            color={colors(theme).primary}
        />
    </View>;
}
