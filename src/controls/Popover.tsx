// eslint-disable-next-line
import React, { ReactNode } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';

import { Themed, colors } from './theme';
import { HasChildren, panelShadow, radius, doubleSpace } from './common';

export function WithPopover({
    body, placement, theme, children,
}: Themed & HasChildren & {
    body: ReactNode,
    placement: 'bottom',
}) {
    return <div css={{
        pointerEvents: 'auto',
        '& .tippy-box[data-theme~=\'custom\']': {
            zIndex: 100,
            backgroundColor: colors(theme).primary,
            ...panelShadow(colors(theme).shadow),
            borderRadius: radius,
        },
    }}>
        <Tippy
            popperOptions={{ strategy: 'fixed' }}
            offset={[0, -10]}
            arrow={false}
            theme='custom'
            placement={placement}
            interactive={true}
            hideOnClick={true}
            animation='shift-away'
            content={
                <div style={{
                    zIndex: 100,
                    padding: doubleSpace,
                }}>
                    {body}
                </div>
            }>
            <div>{children}</div>
        </Tippy>
    </div>;
}
