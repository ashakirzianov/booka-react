import * as React from 'react';

import { WithChildren, Callback, Style } from './common';
import { Link } from './Router';

export type LinkOrButtonProps = WithChildren<{
    style?: Style,
    to?: string,
    onClick?: Callback<void>,
    onHoverIn?: Callback,
    onHoverOut?: Callback,
}>;
export function LinkOrButton(props: LinkOrButtonProps) {
    if (props.to) {
        return <Link
            to={props.to}
            style={{
                textDecoration: 'none',
                cursor: 'pointer',
                ...props.style,
            }}
            // onClick={e => {
            //     e.stopPropagation();
            //     if (!isOpenNewTabEvent(e)) {
            //         e.preventDefault();
            //         if (props.onClick) {
            //             props.onClick();
            //         }
            //     }
            // }}
            onMouseEnter={props.onHoverIn}
            onMouseLeave={props.onHoverOut}
        >
            {props.children}
        </Link>;
    } else {
        return <span
            style={{
                textDecoration: 'none',
                cursor: 'pointer',
                ...props.style,
            }}
            onClick={props.onClick}
            onMouseEnter={props.onHoverIn}
            onMouseLeave={props.onHoverOut}
        >
            {props.children}
        </span>;
    }
}

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}
