import React from 'react';
import { Transition } from 'react-transition-group';
import { HasChildren } from './common';

// TODO: rethink this file

export const defaultAnimationDuration = 400;

export function FadeIn(props: HasChildren & {
    visible: boolean,
}) {
    return <Animated
        in={props.visible}
        start={{ opacity: 0.01 }}
        end={{ opacity: 1 }}
    >
        {props.children}
    </Animated>;
}

type AnimationStyles = {
    opacity?: number,
    transform?: string,
};
function Animated(props: HasChildren & {
    in: boolean,
    duration?: number,
    start: AnimationStyles,
    end: AnimationStyles,
}) {
    const duration = props.duration || defaultAnimationDuration;
    return <Transition in={props.in} timeout={duration}>
        {state =>
            state === 'exited' ? null :
                <div style={{
                    transition: `${duration}ms ease-in-out`,
                    zIndex: 10, // NOTE: fix the glitch when fade in over the top bar
                    ...(state === 'entered' ? props.end : props.start),
                }}>
                    {props.children}
                </div>
        }
    </Transition>;
}
