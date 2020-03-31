/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed } from '../theme';
import {
    buttonHeight, actionCss, actionHoverCss, regularSpace, buttonStyle,
} from '../common';

export function PictureButton({
    callback, pictureUrl, theme,
}: Themed & {
    pictureUrl?: string,
    callback?: () => void,
}) {
    return <button
        style={buttonStyle}
        onClick={callback}
    >
        <img
            src={pictureUrl}
            alt='account'
            css={{
                display: 'flex',
                pointerEvents: 'auto',
                margin: regularSpace,
                justifyContent: 'center',
                alignItems: 'center',
                height: buttonHeight,
                width: buttonHeight,
                ...actionCss({ theme }),
                '&:hover': {
                    ...actionHoverCss({ theme }),
                },
            }}
        />
    </button>;
}
