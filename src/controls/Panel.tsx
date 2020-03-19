import React from 'react';
import { View } from 'react-native';
import { HasChildren, percent, point } from './common';
import { Themed, colors } from '../application';
import { defaultAnimationDuration } from './Animations';

export function Panel(props: HasChildren & Themed & {
    animation?: {
        entered: boolean,
    },
}) {
    return <View
        style={{
            alignSelf: 'center',
            overflow: 'scroll',
            backgroundColor: colors(props.theme).secondary,
            width: percent(100),
            maxWidth: point(50),
            maxHeight: percent(100),
            margin: '0 auto',
            borderRadius: props.theme.radius,
            padding: point(1),
            ...({
                boxShadow: `0px 0px 10px ${colors(props.theme).shadow}`,
                zIndex: 10,
            } as {}),
            ...(props.animation && {
                transitionDuration: `${defaultAnimationDuration}ms`,
                transform: props.animation.entered ? [] : [{ translateY: '100%' as any }],
            }),
        }}
    >
        <div onClick={e => e.stopPropagation()} style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
        }}>
            {props.children}
        </div>
    </View>;
}
