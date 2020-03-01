import { Dispatch, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppAction } from '../ducks';
import { Callback } from '../atoms';

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}

export function useTheme() {
    return useAppSelector(s => s.theme);
}

export function useCopy(callback: Callback<ClipboardEvent>) {
    useEffect(() => {
        window.addEventListener('copy', callback as any);

        return function unsubscribe() {
            window.removeEventListener('copy', callback as any);
        };
    }, [callback]);
}
