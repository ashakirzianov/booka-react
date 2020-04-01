import React from 'react';

export function isDebug() {
    return process.env.NODE_ENV === 'development';
}

export async function initWhyDidYouRender() {
    if (isDebug()) {
        const { default: why } = await import('@welldone-software/why-did-you-render');
        why(React);
    }
}

export function trackComponent(f: (p: any) => any) {
    if (isDebug()) {
        (f as any).whyDidYouRender = true;
    }
}
