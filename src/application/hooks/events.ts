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

type SelectionEvent = {
    getRect(): {
        top: number, left: number, height: number, width: number,
    } | undefined,
};
export function useOnSelection(callback: (e: SelectionEvent) => void) {
    const actual = useCallback((e: Event) => {
        callback({
            getRect() {
                const selection = window.getSelection();
                const range = selection?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();
                return rect && {
                    top: rect.top, left: rect.left,
                    width: rect.width, height: rect.height,
                };
            },
        });
    }, [callback]);
    useEffect(() => {
        window.document.addEventListener('selectionchange', actual);

        return function unsubscribe() {
            window.document.removeEventListener('selectionchange', actual);
        };
    }, [actual]);
}

export function useWriteClipboardText() {
    return useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);
}
