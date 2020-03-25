import * as React from 'react';

import {
    Size, HasChildren,
} from './common';
import { FadeIn } from './Animations';

export function FixedPanel({
    children, open, placement,
}: HasChildren & {
    placement: 'top' | 'bottom',
    open: boolean,
    paddingHorizontal?: Size,
}) {
    return <FadeIn visible={open}>
        <div style={{
            pointerEvents: 'none',
            display: 'flex',
            margin: 0,
            padding: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            position: 'fixed',
            top: placement === 'top' ? 0 : undefined,
            bottom: placement === 'bottom' ? 0 : undefined,
            left: 0,
            zIndex: 5,
        }}>
            {children}
        </div>
    </FadeIn >;
}
