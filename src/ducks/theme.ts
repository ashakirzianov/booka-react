import { AppAction } from './app';
import { Theme, PaletteName } from '../application';

export type ThemeState = Theme;

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

const init: Theme = {
    palettes: {
        light: {
            colors: {
                text: '#000',
                primary: '#fff',
                secondary: '#eee',
                accent: '#777',
                highlight: '#aaf',
                shadow: '#000',
                semiTransparent: 'rgba(0, 0, 0, 0.3)',
            },
            highlights: {
                quote: '#fbe381',
            },
        },
        sepia: {
            colors: {
                text: '#5f3e24',
                primary: '#f9f3e9',
                secondary: '#e6e0d6',
                accent: '#987',
                highlight: '#000',
                shadow: '#000',
                semiTransparent: 'rgba(0, 0, 0, 0.3)',
            },
            highlights: {
                quote: '#fbe381',
            },
        },
        dark: {
            colors: {
                text: '#999',
                primary: '#000',
                secondary: '#222',
                accent: '#ddd',
                highlight: '#fff',
                shadow: '#000',
                semiTransparent: 'rgba(0, 0, 0, 0.3)',
            },
            highlights: {
                quote: '#c8b050',
            },
        },
    },
    currentPalette: 'light',
    fontFamilies: {
        book: 'Georgia',
        menu: 'Open Sans',
    },
    fontSizes: {
        smallest: 14,
        small: 22,
        normal: 26,
        large: 30,
        largest: 36,
        text: 26,
    },
    fontScale: 1,
    radius: 5,
};
