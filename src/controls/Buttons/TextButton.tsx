/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, FontSizes, FontFamilies, getFontSize, colors, getFontFamily,
} from '../theme';
import { buttonStyle } from '../common';

export function TextButton({
    onClick, theme, text,
    fontSize, fontFamily,
}: Themed & {
    text: string,
    fontSize: keyof FontSizes,
    fontFamily: keyof FontFamilies,
    onClick: () => void,
}) {
    return <button
        css={{
            ...buttonStyle,
            fontSize: getFontSize(theme, fontSize),
            fontFamily: getFontFamily(theme, fontFamily),
            color: colors(theme).accent,
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
        onClick={onClick}
    >
        {text}
    </button>;
}
