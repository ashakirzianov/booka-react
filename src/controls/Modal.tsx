import * as React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-transition-group';

import { Themed } from '../application';
import { Triad, Row } from './Layout';
import { HasChildren, semiTransparent } from './common';
import { defaultAnimationDuration } from './Animations';
import { OverlayPanel } from './Panel';
import { Label } from './Label';
import { IconButton } from './IconButton';

export type ModalProps = Parameters<typeof Modal>[0];
export function Modal(props: HasChildren & Themed & {
    open: boolean,
    title?: string,
    close: () => void,
}) {
    return <Transition in={props.open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: semiTransparent,
                zIndex: 10,
                transition: `${defaultAnimationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={props.close}
            >
                <OverlayPanel
                    animation={{
                        entered: state === 'entered',
                    }}
                    theme={props.theme}>
                    <View style={{ flex: 1 }}>
                        <Row>
                            <Triad
                                center={<Label
                                    theme={props.theme}
                                    text={props.title ?? ''}
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
                </OverlayPanel>
            </div>
        }
    </Transition>;
}
