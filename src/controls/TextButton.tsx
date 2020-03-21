/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, FontSizes, FontFamilies, getFontSize, colors, getFontFamily,
} from '../application';

export function TextButton({
    onClick, theme, text,
    fontSize, fontFamily,
}: Themed & {
    text: string,
    fontSize: keyof FontSizes,
    fontFamily: keyof FontFamilies,
    onClick: () => void,
}) {
    return <div
        css={{
            cursor: 'default',
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
    </div>;
}
