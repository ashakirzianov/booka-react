// eslint-disable-next-line
import React from 'react';
import { Themed, colors } from '../application';
/** @jsx jsx */
import { jsx } from '@emotion/core';

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
                borderRadius: '50%',
                alignItems: 'center',
                borderColor: colors(theme).accent,
                borderWidth: 2,
                borderStyle: 'solid',
                ...({
                    ':hover': {
                        borderColor: colors(theme).highlight,
                    },
                }),
            }}
        />
    </div>;
}
