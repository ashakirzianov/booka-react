import React from 'react';

export function isDebug() {
    return process.env.NODE_ENV === 'development';
}

export async function initWhyDidYouRender() {
    if (isDebug()) {
        const { default: why } = await import('@welldone-software/why-did-you-render');
        why(React, {
            trackAllPureComponents: true,
        });
    }
}

export function trackComponent(f: (p: any) => any) {
    if (isDebug()) {
        (f as any).whyDidYouRender = true;
    }
}

export function sameArrays<T>(a1: T[], a2: T[]) {
    return a1.length === a2.length && a1.every((v, idx) => v === a2[idx]);
}
