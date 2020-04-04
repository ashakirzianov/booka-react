import { Dispatch, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    AppState, AppAction, AppActionType, PayloadForType,
} from '../../ducks';

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}

export function useDispatchCallback<T extends AppActionType>(type: T) {
    const dispatch = useAppDispatch();
    return useCallback((payload: PayloadForType<T>) => dispatch({
        type, payload,
    } as any), [dispatch, type]);
}
