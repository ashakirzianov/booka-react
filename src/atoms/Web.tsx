import * as React from 'react';

import { WithChildren, Callback } from './common';

export type HyperlinkProps = WithChildren<{
    style?: React.CSSProperties,
    href?: string,
    onClick?: Callback<void>,
    onHoverIn?: Callback,
    onHoverOut?: Callback,
}>;
function HyperlinkC(props: HyperlinkProps) {
    return <a
        href={props.href}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            ...props.style,
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (props.onClick) {
                    props.onClick();
                }
            }
        }}
        onMouseEnter={props.onHoverIn}
        onMouseLeave={props.onHoverOut}
    >
        {props.children}
    </a>;
}
export const Hyperlink = hoverable(HyperlinkC);

type HoverableProps<T> = T extends { style?: infer S }
    ? T & { style?: S & { ':hover'?: S } }
    : T;
// TODO: use something instead of Radium
export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<HoverableProps<T>> {
    return Cmp as any;
}

function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}
