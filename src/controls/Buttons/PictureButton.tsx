/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from '../theme';
import { buttonHeight, actionShadow, normalMargin, buttonStyle } from '../common';

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
                pointerEvents: 'all',
                margin: normalMargin,
                justifyContent: 'center',
                alignItems: 'center',
                height: buttonHeight,
                width: buttonHeight,
                boxShadow: actionShadow(colors(theme).shadow),
                '&:hover': {
                    boxShadow: actionShadow(colors(theme).highlight),
                },
            }}
        />
    </button>;
}
