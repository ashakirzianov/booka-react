import { useAppSelector, useAppCallback } from './redux';

export function useTheme() {
    return useAppSelector(s => s.theme);
}

export function useSetPalette() {
    return useAppCallback('theme/set-palette');
}

export function useIncrementScale() {
    return useAppCallback('theme/increment-scale');
}
