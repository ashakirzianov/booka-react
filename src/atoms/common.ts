import * as React from 'react';

import { platformValue } from './platform';

export type WithChildren<P = {}> = React.PropsWithChildren<P>;

export type Style = React.CSSProperties & {
    '&:hover'?: React.CSSProperties,
};

export type Func<Argument, Return> =
    void extends Argument ? () => Return
    : (
        undefined extends Argument
        ? (payload?: Argument) => Return
        : (payload: Argument) => Return
    );
export type Callback<Argument = void> = Func<Argument, void>;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return platformValue<Size>({
        web: `${size}em`,
        default: size * 12,
    });
}

export const defaults = {
    semiTransparent: 'rgba(0, 0, 0, 0.3)',
    animationDuration: 400,
    headerHeight: 2,
};

export function assertNever(x: never) {
    return x;
}
