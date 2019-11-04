import * as React from 'react';
import {
    Text, ActivityIndicator, TouchableWithoutFeedback,
    View, SafeAreaView,
} from 'react-native';

import { colors, getFontSize } from './theme';
import { point, defaults } from './common';
import {
    TextLineProps, ClickableProps, FullScreenActivityIndicatorProps,
} from './Basics';

export function TextLine(props: TextLineProps) {
    return <Text
        style={{
            fontFamily: props.theme.fontFamilies[props.fontFamily || 'menu'],
            fontSize: getFontSize(props.theme, props.fontSize),
        }}
    >
        {props.text}
    </Text>;
}

export function FullScreenActivityIndicator(props: FullScreenActivityIndicatorProps) {
    return <View
        style={{
            position: 'absolute',
            top: 0, left: 0,
            minHeight: '100%',
            minWidth: '100%',
            width: '100%',
            height: '100%',
            backgroundColor: defaults.semiTransparent,
            justifyContent: 'center',
            zIndex: 10,
        }}
    >
        <ActivityIndicator
            size='large'
            color={colors(props.theme).primary}
        />
    </View>;
}

export function Separator() {
    return null;
}

export function Clickable(props: ClickableProps) {
    return <TouchableWithoutFeedback
        onPress={props.onClick}
    >
        <View>
            {props.children}
        </View>
    </TouchableWithoutFeedback>;
}

export function Tab() {
    return null;
}

export function EmptyLine() {
    return <SafeAreaView>
        <View
            style={{
                flexDirection: 'row',
                height: point(defaults.headerHeight),
            }}
        />
    </SafeAreaView>;
}
