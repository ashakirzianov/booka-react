/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from '../theme';
import { buttonHeight, actionShadow, margin } from '../common';

export function PictureButton({
    onClick, pictureUrl, theme,
}: Themed & {
    pictureUrl?: string,
    onClick?: () => void,
}) {
    return <div
        onClick={onClick}
    >
        <img
            src={pictureUrl}
            alt='account'
            css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: buttonHeight,
                width: buttonHeight,
                margin: margin,
                boxShadow: actionShadow(colors(theme).shadow),
                '&:hover': {
                    boxShadow: actionShadow(colors(theme).highlight),
                },
            }}
        />
    </div>;
}
