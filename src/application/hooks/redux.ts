import { Dispatch, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppAction, ActionWithPayload } from '../../ducks';

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}

export function useAppCallback<T extends ActionWithPayload['type']>(type: T) {
    const dispatch = useAppDispatch();
    type PayloadType = Extract<ActionWithPayload, { type: T }>['payload'];
    return useCallback((payload: PayloadType) => {
        dispatch({ type, payload } as any);
    }, [dispatch, type]);
}
