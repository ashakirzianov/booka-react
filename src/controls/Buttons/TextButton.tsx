/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, FontSizes, FontFamilies, colors,
} from '../theme';
import { buttonStyle, fontCss } from '../common';

export function TextButton({
    callback, theme, text,
    fontSize, fontFamily,
}: Themed & {
    text: string,
    fontSize: keyof FontSizes,
    fontFamily: keyof FontFamilies,
    callback: () => void,
}) {
    return <button
        css={{
            ...buttonStyle,
            ...fontCss({ theme, fontSize, fontFamily }),
            color: colors(theme).accent,
            '&:hover': {
                color: colors(theme).highlight,
            },
        }}
        onClick={callback}
    >
        {text}
    </button>;
}
