// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { assertNever } from 'booka-common';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faTimes, faAngleLeft, faListUl, faFontCase, faCircle, faSignIn,
    faQuestion, faBookmark, faHighlighter, faUnderline,
    faTrashAlt, faMobile, faDesktop, faFileAlt, faQuoteRight, faClone,
    faUser,
} from '@fortawesome/pro-light-svg-icons';
import {
    faFacebookSquare, faSafari, faChrome, faFirefox, faEdge, faInternetExplorer,
} from '@fortawesome/free-brands-svg-icons';
import {
    faBookmark as faSolidBookmark,
} from '@fortawesome/free-solid-svg-icons';

import { PaletteColor, Themed, colors } from './theme';
import { Size } from './common';

export type IconName =
    | 'close' | 'left' | 'items' | 'letter'
    | 'circle' | 'sign-in' | 'user'
    | 'upload'
    | 'bookmark-empty' | 'bookmark-solid'
    | 'highlight' | 'underline'
    | 'remove'
    | 'mobile' | 'desktop'
    | 'pages'
    | 'copy' | 'quote'
    | 'safari' | 'chrome' | 'firefox' | 'edge' | 'ie' | 'facebook'
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
    const icon = iconForName(name);
    return <div
        css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin,
            fontSize: size || '1em',
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
        <FontAwesomeIcon icon={icon} />
    </div>;
}

function iconForName(name: IconName) {
    switch (name) {
        case 'close':
            return faTimes;
        case 'left':
            return faAngleLeft;
        case 'items':
            return faListUl;
        case 'letter':
            return faFontCase;
        case 'circle':
            return faCircle;
        case 'sign-in':
            return faSignIn;
        case 'facebook':
            return faFacebookSquare;
        case 'upload':
            return faPlus;
        case 'bookmark-empty':
            return faBookmark;
        case 'bookmark-solid':
            return faSolidBookmark;
        case 'highlight':
            return faHighlighter;
        case 'underline':
            return faUnderline;
        case 'remove':
            return faTrashAlt;
        case 'safari':
            return faSafari;
        case 'chrome':
            return faChrome;
        case 'firefox':
            return faFirefox;
        case 'edge':
            return faEdge;
        case 'ie':
            return faInternetExplorer;
        case 'mobile':
            return faMobile;
        case 'desktop':
            return faDesktop;
        case 'pages':
            return faFileAlt;
        case 'copy':
            return faClone;
        case 'quote':
            return faQuoteRight;
        case 'user':
            return faUser;
        default:
            assertNever(name);
            return faQuestion;
    }
}
