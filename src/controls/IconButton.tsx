import * as React from 'react';

import { Themed } from '../application';
import { IconName, Icon } from './Icon';

export function IconButton({
    icon, theme,
    onClick, onHoverIn, onHoverOut,
}: Themed & {
    icon: IconName,
    onClick?: () => void,
    onHoverIn?: () => void,
    onHoverOut?: () => void,
}) {
    return <Icon
        theme={theme}
        name={icon}
        size={24}
        color='accent'
        hoverColor='highlight'
        onClick={onClick}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
    />;
}
