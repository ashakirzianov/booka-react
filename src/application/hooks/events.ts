import { useEffect, useCallback } from 'react';
import * as clipboard from 'clipboard-polyfill';

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

type EnhancedEvent = {
    getSelectionRect(): {
        top: number, left: number, height: number, width: number,
    } | undefined,
};
export function useOnScroll(callback: (e: EnhancedEvent) => void) {
    const actual = useEnhancedCallback(callback);
    useEffect(() => {
        window.addEventListener('scroll', actual);

        return () => window.removeEventListener('scroll', actual);
    }, [actual]);
}
export function useOnSelection(callback: (e: EnhancedEvent) => void) {
    const actual = useEnhancedCallback(callback);
    useEffect(() => {
        window.document.addEventListener('selectionchange', actual);

        return function unsubscribe() {
            window.document.removeEventListener('selectionchange', actual);
        };
    }, [actual]);
}

function useEnhancedCallback(callback: (e: EnhancedEvent) => void) {
    return useCallback(() => {
        callback({
            getSelectionRect() {
                const selection = window.getSelection();
                const range = selection && selection.rangeCount > 0
                    ? selection.getRangeAt(0) : undefined;
                const rect = range?.getBoundingClientRect();
                return rect && {
                    top: rect.top, left: rect.left,
                    width: rect.width, height: rect.height,
                };
            },
        });
    }, [callback]);
}

export function useWriteClipboardText() {
    return useCallback((text: string) => {
        clipboard.writeText(text);
    }, []);
}
