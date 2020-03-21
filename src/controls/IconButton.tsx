import * as React from 'react';
import { View } from 'react-native';

import { Themed, colors } from '../application';
import { IconName, Icon } from './Icon';
import { point, actionShadow } from './common';

export function IconButton({
    icon, theme,
    onClick, onHoverIn, onHoverOut,
}: Themed & {
    icon: IconName,
    onClick?: () => void,
    onHoverIn?: () => void,
    onHoverOut?: () => void,
}) {
    return <div style={{
        margin: point(0.5),
        padding: point(0.7),
        boxShadow: actionShadow(colors(theme).shadow),
    }}>
        <Icon
            theme={theme}
            name={icon}
            size={24}
            color='accent'
            hoverColor='highlight'
            onClick={onClick}
            onHoverIn={onHoverIn}
            onHoverOut={onHoverOut}
        />
    </div>;
}
