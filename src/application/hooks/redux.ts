import { Dispatch, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppAction, ActionForType } from '../../ducks';

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}

type ActionPayload<T> = T extends { payload: infer P }
    ? P
    : undefined;
export function useAppCallback<T extends AppAction['type']>(type: T) {
    const dispatch = useAppDispatch();
    return useCallback((p: ActionPayload<ActionForType<T>>) => {
        dispatch({ type, ...p as any });
    }, [dispatch, type]);
}
