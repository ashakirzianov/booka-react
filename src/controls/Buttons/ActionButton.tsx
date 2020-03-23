/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Themed, colors, getFontSize, getFontFamily } from '../theme';
import { actionShadow, point } from '../common';

export function ActionButton({
    text, onClick, theme,
}: Themed & {
    text: string,
    onClick?: () => void,
}) {
    return <input
        type='button'
        value={text}
        onClick={onClick}
        css={{
            width: point(8),
            padding: 10,
            cursor: 'pointer',
            borderStyle: 'solid',
            borderColor: colors(theme).accent,
            borderWidth: 2,
            fontSize: getFontSize(theme, 'small'),
            fontFamily: getFontFamily(theme, 'menu'),
            color: colors(theme).accent,
            boxShadow: actionShadow(colors(theme).shadow),
            '&:hover': {
                borderColor: colors(theme).highlight,
                color: colors(theme).highlight,
                boxShadow: actionShadow(colors(theme).highlight),
            },
        }}
    />;
}
