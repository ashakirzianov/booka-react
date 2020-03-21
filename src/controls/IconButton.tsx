import * as React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors } from '../application';
import { IconName, Icon } from './Icon';
import { point, actionShadow, buttonMargin, buttonHeight } from './common';

export function IconButton({
    icon, theme,
    onClick, onHoverIn, onHoverOut,
}: Themed & {
    icon: IconName,
    onClick?: () => void,
    onHoverIn?: () => void,
    onHoverOut?: () => void,
}) {
    return <div css={{
        display: 'flex',
        margin: buttonMargin,
        height: buttonHeight,
        width: buttonHeight,
        color: colors(theme).accent,
        boxShadow: actionShadow(colors(theme).shadow),
        '&:hover': {
            color: colors(theme).highlight,
            boxShadow: actionShadow(colors(theme).highlight),
        },
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Icon
            theme={theme}
            name={icon}
            size={24}
            onClick={onClick}
            onHoverIn={onHoverIn}
            onHoverOut={onHoverOut}
        />
    </div>;
}
