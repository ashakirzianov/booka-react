import { Dispatch } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppAction } from '../ducks';

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}
