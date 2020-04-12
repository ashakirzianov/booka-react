// eslint-disable-next-line
import React, { ReactNode } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';

import { Themed, colors } from './theme';
import { HasChildren, panelShadow, radius } from './common';

export function WithPopover({
    body, placement, theme, children,
}: Themed & HasChildren & {
    body: ReactNode,
    placement: 'bottom',
}) {
    return <div css={{
        pointerEvents: 'auto',
        '& .tippy-box[data-theme~=\'custom\']': {
            backgroundColor: colors(theme).secondary,
            ...panelShadow(colors(theme).shadow),
            borderRadius: radius,
        },
    }}>
        <Tippy
            offset={[0, -10]}
            arrow={false}
            theme='custom'
            placement={placement}
            interactive={true}
            hideOnClick={true}
            animation='shift-away'
            content={<div>{body}</div>}>
            <div>{children}</div>
        </Tippy>
    </div>;
}
