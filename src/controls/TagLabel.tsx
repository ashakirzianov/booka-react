/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors, PaletteColor,
} from './theme';
import { regularSpace, xsmallSpace, fontCss } from './common';

export function TagLabel({
    text, theme, color, tooltip,
}: Themed & {
    text: string,
    color?: PaletteColor,
    tooltip?: string,
}) {
    const actualColor = colors(theme)[color ?? 'accent'];
    return <div css={{
        margin: xsmallSpace,
        paddingLeft: regularSpace, paddingRight: regularSpace,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: theme.fontSizes.xsmall,
        ...fontCss({ theme, fontSize: 'xsmall' }),
        borderColor: actualColor,
        color: actualColor,
    }}
        title={tooltip}
    >
        {text}
    </div>;
}
