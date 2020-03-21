/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors } from '../application';
import { buttonHeight, actionShadow, buttonMargin } from './common';

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
                margin: buttonMargin,
                boxShadow: actionShadow(colors(theme).shadow),
                '&:hover': {
                    boxShadow: actionShadow(colors(theme).highlight),
                },
            }}
        />
    </div>;
}
