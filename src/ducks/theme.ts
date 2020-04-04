import { AppAction } from './app';
import { Theme, PaletteName, defaultTheme } from '../core';

export type ThemeSetPaletteAction = {
    type: 'theme-set-palette',
    payload: PaletteName,
};
export type ThemeIncrementScaleAction = {
    type: 'theme-increment-scale',
    payload: number,
};
export type ThemeAction =
    | ThemeSetPaletteAction | ThemeIncrementScaleAction;

export type ThemeState = Theme;
const init: ThemeState = defaultTheme;
export function themeReducer(state: ThemeState = init, action: AppAction) {
    switch (action.type) {
        case 'theme-set-palette':
            return {
                ...state,
                currentPalette: action.payload,
            };
        case 'theme-increment-scale':
            return {
                ...state,
                fontScale: state.fontScale + action.payload,
            };
        default:
            return state;
    }
}
