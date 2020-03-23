import * as React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-transition-group';

import { Theme } from '../core';
import { TextLine } from './Basics';
import { IconButton } from './Buttons';
import { OverlayBox } from './OverlayBox';
import { WithChildren, defaults } from './common';
import { Triad, Row } from './Layout';

export type ModalProps = Parameters<typeof Modal>[0];
export function Modal(props: WithChildren & {
    theme: Theme,
    open: boolean,
    title?: string,
    close: () => void,
}) {
    return <Transition in={props.open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: defaults.semiTransparent,
                zIndex: 10,
                transition: `${defaults.animationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={props.close}
            >
                <OverlayBox
                    animation={{
                        entered: state === 'entered',
                    }}
                    theme={props.theme}>
                    <View style={{ flex: 1 }}>
                        <Row>
                            <Triad
                                center={<TextLine
                                    theme={props.theme}
                                    color='text'
                                    text={props.title}
                                />}
                                left={<IconButton
                                    theme={props.theme}
                                    onClick={props.close}
                                    icon='close'
                                />}
                            />
                        </Row>
                        <View style={{
                            flex: 1,
                            alignItems: 'stretch',
                            overflow: 'scroll',
                        }}
                        >
                            {props.children}
                        </View>
                    </View>
                </OverlayBox>
            </div>
        }
    </Transition>;
}
