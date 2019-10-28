import { Theme } from '../atoms';
import { AppAction } from './app';

export type ThemeState = Theme;

export function themeReducer(state: Theme = defaultTheme, action: AppAction) {
    return state;
}

const defaultTheme: Theme = {
    palettes: {
        light: {
            colors: {
                text: '#000',
                primary: '#fff',
                secondary: '#eee',
                accent: '#777',
                highlight: '#aaf',
                shadow: '#000',
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
            },
            highlights: {
                quote: '#c8b050',
            },
        },
    },
    currentPalette: 'light',
    fontFamilies: {
        book: 'Georgia',
        menu: 'Helvetica',
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
