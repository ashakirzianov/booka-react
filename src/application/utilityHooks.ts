import { useEffect } from 'react';

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
        window.addEventListener('click', callback);

        return () => window.removeEventListener('click', callback);
    }, [callback]);
}
