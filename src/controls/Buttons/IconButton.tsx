/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors } from '../theme';
import { IconName, Icon } from '../Icon';
import {
    buttonHeight, regularSpace, buttonStyle, smallButtonHeight,
} from '../common';

export function IconButton({
    icon, theme,
    callback, onHoverIn, onHoverOut,
}: Themed & {
    icon: IconName,
    callback?: () => void,
    onHoverIn?: () => void,
    onHoverOut?: () => void,
}) {
    return <button style={buttonStyle}
        onClick={callback}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
    >
        <div css={{
            display: 'flex',
            pointerEvents: 'auto',
            margin: regularSpace,
            borderWidth: 0,
            height: buttonHeight,
            width: buttonHeight,
            color: colors(theme).accent,
            '&:hover': {
                color: colors(theme).highlight,
            },
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Icon
                theme={theme}
                name={icon}
                size={24}
            />
        </div>
    </button>;
}

export function PlaneIconButton({
    icon, theme,
    callback,
}: Themed & {
    icon: IconName,
    callback?: () => void,
}) {
    return <button style={buttonStyle}
        onClick={callback}
    >
        <div css={{
            // border: '1px solid red',
            display: 'flex',
            pointerEvents: 'auto',
            padding: regularSpace,
            height: smallButtonHeight,
            width: smallButtonHeight,
            color: colors(theme).accent,
            '&:hover': {
                color: colors(theme).highlight,
            },
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Icon
                theme={theme}
                name={icon}
                size={smallButtonHeight}
            />
        </div>
    </button>;
}
