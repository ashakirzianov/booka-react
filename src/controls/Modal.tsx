import * as React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-transition-group';

import { Themed, colors } from './theme';
import {
    HasChildren, regularSpace, fontCss, panelShadow,
    userAreaWidth, percent, radius,
} from './common';
import { defaultAnimationDuration } from './Animations';
import { PlaneIconButton } from './Buttons';

export type ModalProps = Parameters<typeof Modal>[0];
export function Modal({
    title, close, open, theme, children,
}: HasChildren & Themed & {
    open: boolean,
    title?: string,
    close: () => void,
}) {
    return <Transition in={open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors(theme).semiTransparent,
                zIndex: 10,
                transition: `${defaultAnimationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={close}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 1,
                    width: percent(100),
                    maxWidth: userAreaWidth,
                    maxHeight: '100%',
                    overflow: 'scroll',
                    zIndex: 10,
                    backgroundColor: colors(theme).secondary,
                    boxShadow: panelShadow(colors(theme).shadow),
                    borderRadius: radius,
                    pointerEvents: 'auto',
                    transitionDuration: `${defaultAnimationDuration}ms`,
                    transform: state === 'entered'
                        ? 'none' : 'translateY(100%)',
                }}
                    onClick={e => e.stopPropagation()}
                >
                    <ModalTitle
                        theme={theme}
                        title={title}
                        close={close}
                    />
                    <View style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        overflow: 'scroll',
                        justifyContent: 'flex-start',
                    }}
                    >
                        {children}
                    </View>
                </div>
            </div>
        }
    </Transition >;
}

function ModalTitle({ theme, title, close }: Themed & {
    title: string | undefined,
    close: () => void,
}) {
    if (title === undefined) {
        return null;
    }
    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <View style={{
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            marginLeft: regularSpace, marginRight: regularSpace,
            justifyContent: 'center',
        }}>
            <span title={title} style={{
                padding: regularSpace,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                ...fontCss({ theme, fontSize: 'large' }),
                color: colors(theme).accent,
            }}>
                {title}
            </span>
        </View>
        <View style={{
            minWidth: 'auto',
            flexBasis: 1,
            flexGrow: 0,
            flexShrink: 0,
        }}>
            <PlaneIconButton
                theme={theme}
                callback={close}
                icon='close'
            />
        </View>
    </View>;
}
