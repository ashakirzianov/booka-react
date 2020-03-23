export type FontFamily =
    | 'Georgia' | 'San Francisco' | 'Helvetica'
    | 'Open Sans'
    ;
export type FontSize = number;
export type Color = string;

export type Palette = {
    colors: {
        text: Color,
        accent: Color,
        highlight: Color,
        primary: Color,
        secondary: Color,
        shadow: Color,
        semiTransparent: Color,
        neutral: Color,
        positive: Color,
        negative: Color,
        warning: Color,
    },
    highlights: {
        quote: Color,
    },
};
export type PaletteColor = keyof Palette['colors'];
export type HighlightsColor = keyof Palette['highlights'];
export type FontSizes = {
    smallest: FontSize,
    small: FontSize,
    normal: FontSize,
    large: FontSize,
    largest: FontSize,
    text: FontSize,
};
export type FontFamilies = {
    book: FontFamily,
    menu: FontFamily,
};

export type Palettes = {
    light: Palette,
    sepia: Palette,
    dark: Palette,
};
export type PaletteName = keyof Palettes;

export type Theme = {
    palettes: Palettes,
    currentPalette: PaletteName,
    fontScale: number,
    fontFamilies: FontFamilies,
    fontSizes: FontSizes,
    radius: number,
};

export type Themed = {
    theme: Theme,
};

export function colors(theme: Theme): Palette['colors'] {
    return theme.palettes[theme.currentPalette].colors;
}

export function getHighlights(theme: Theme): Palette['highlights'] {
    return theme.palettes[theme.currentPalette].highlights;
}

export function getFontSize(theme: Theme, size?: keyof FontSizes): number {
    return size === 'text'
        ? theme.fontSizes.text * theme.fontScale
        : theme.fontSizes[size || 'normal'];
}

export function getFontFamily(theme: Theme, key: keyof FontFamilies): string {
    return theme.fontFamilies[key];
}
