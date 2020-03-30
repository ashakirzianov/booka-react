import React from 'react';
import { useTheme } from '../application';
import { IconButton } from '../controls';

export function UploadButton() {
    const { theme } = useTheme();

    return <IconButton
        theme={theme}
        icon='upload'
    />;
}
