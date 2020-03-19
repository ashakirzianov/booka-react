import * as React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { assertNever } from 'booka-common';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
    FaCircle, FaSignInAlt, FaFacebookSquare, FaCloudUploadAlt,
    FaQuestion,
} from 'react-icons/fa';
import { PaletteColor, Themed, colors } from '../application';
import { Size } from './common';

export type IconName =
    | 'close' | 'left' | 'items' | 'letter'
    | 'circle' | 'sign-in' | 'facebook'
    | 'upload'
    ;

export type IconProps = Themed & {
    name: IconName,
    size?: Size,
    margin?: Size,
    color?: PaletteColor,
    hoverColor?: PaletteColor,
    onClick?: () => void,
    onHoverIn?: () => void,
    onHoverOut?: () => void,
};

export function Icon({
    theme, name, size, margin, color, hoverColor,
    onClick, onHoverIn, onHoverOut,
}: IconProps) {
    return <div
        css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin,
            color: color
                ? colors(theme)[color]
                : undefined,
            '&:hover': {
                color: hoverColor
                    ? colors(theme)[hoverColor]
                    : undefined,
            },
        }}
        onClick={onClick}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
    >
        {React.createElement(iconForName(name), {
            size: size || '1em',
        })}
    </div>;
}

function iconForName(name: IconName) {
    switch (name) {
        case 'close':
            return FaTimes;
        case 'left':
            return FaAngleLeft;
        case 'items':
            return FaBars;
        case 'letter':
            return FaFont;
        case 'circle':
            return FaCircle;
        case 'sign-in':
            return FaSignInAlt;
        case 'facebook':
            return FaFacebookSquare;
        case 'upload':
            return FaCloudUploadAlt;
        default:
            assertNever(name);
            return FaQuestion;
    }
}
