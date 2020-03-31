// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { assertNever } from 'booka-common';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
    FaCircle, FaSignInAlt, FaFacebookSquare,
    FaQuestion, FaBookmark, FaRegBookmark, FaHighlighter, FaUnderline,
    FaRegTrashAlt, FaPlus,
    FaSafari, FaChrome, FaFirefox, FaEdge, FaInternetExplorer,
    FaMobile, FaDesktop,
} from 'react-icons/fa';
import { PaletteColor, Themed, colors } from './theme';
import { Size } from './common';

export type IconName =
    | 'close' | 'left' | 'items' | 'letter'
    | 'circle' | 'sign-in' | 'facebook'
    | 'upload'
    | 'bookmark-empty' | 'bookmark-solid'
    | 'highlight' | 'underline'
    | 'remove'
    | 'safari' | 'chrome' | 'firefox' | 'edge' | 'ie'
    | 'mobile' | 'desktop'
    ;

export type IconProps = Themed & {
    name: IconName,
    size?: Size,
    margin?: Size,
    color?: PaletteColor,
    hoverColor?: PaletteColor,
};

export function Icon({
    theme, name, size, margin, color, hoverColor,
}: IconProps) {
    const IconClass = iconClassForName(name);
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
    >
        <IconClass
            size={size || '1em'}
        />
    </div>;
}

function iconClassForName(name: IconName) {
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
            return FaPlus;
        case 'bookmark-empty':
            return FaRegBookmark;
        case 'bookmark-solid':
            return FaBookmark;
        case 'highlight':
            return FaHighlighter;
        case 'underline':
            return FaUnderline;
        case 'remove':
            return FaRegTrashAlt;
        case 'safari':
            return FaSafari;
        case 'chrome':
            return FaChrome;
        case 'firefox':
            return FaFirefox;
        case 'edge':
            return FaEdge;
        case 'ie':
            return FaInternetExplorer;
        case 'mobile':
            return FaMobile;
        case 'desktop':
            return FaDesktop;
        default:
            assertNever(name);
            return FaQuestion;
    }
}
