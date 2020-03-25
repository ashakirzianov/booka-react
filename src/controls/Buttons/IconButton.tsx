/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors } from '../theme';
import { IconName, Icon } from '../Icon';
import { actionShadow, buttonHeight, actionBack, normalMargin } from '../common';

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
        pointerEvents: 'all',
        margin: normalMargin,
        borderWidth: 0,
        height: buttonHeight,
        width: buttonHeight,
        backgroundColor: actionBack(theme),
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
