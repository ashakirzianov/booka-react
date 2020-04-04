import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { PaletteName } from '../../core';

export function useTheme() {
    const theme = useAppSelector(s => s.theme);
    const dispatch = useAppDispatch();
    const setPalette = useCallback((name: PaletteName) => dispatch({
        type: 'theme-set-palette',
        payload: name,
    }), [dispatch]);
    const incrementScale = useCallback((inc: number) => dispatch({
        type: 'theme-increment-scale',
        payload: inc,
    }), [dispatch]);

    return { theme, setPalette, incrementScale };
}
