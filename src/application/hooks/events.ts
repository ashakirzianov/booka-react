import { useEffect, useCallback } from 'react';

export type ClipboardEvent = {
    preventDefault: () => void,
    clipboardData: {
        setData: (format: 'text/plain', text: string) => void,
    },
};
export function useOnCopy(callback: (e: ClipboardEvent) => void) {
    useEffect(() => {
        window.addEventListener('copy', callback as any);

        return () => window.removeEventListener('copy', callback as any);
    }, [callback]);
}

export function useOnClick(callback: (e: MouseEvent) => void) {
    useEffect(() => {
        window.addEventListener('mouseup', callback);

        return () => window.removeEventListener('mouseup', callback);
    }, [callback]);
}

export function useOnScroll(callback: (e: Event) => void) {
    useEffect(() => {
        window.addEventListener('scroll', callback);

        return () => window.removeEventListener('scroll', callback);
    }, [callback]);
}

export function useWriteClipboardText() {
    return useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);
}
