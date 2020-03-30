import React from 'react';
import { useTheme } from '../application';
import { IconButton, WithPopover, Label } from '../controls';
import { Themed } from '../core';

export function UploadButton() {
    const { theme } = useTheme();

    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={<UploadPanel
            theme={theme}
        />}
    >
        <IconButton
            theme={theme}
            icon='upload'
        />
    </WithPopover>;
}

export function UploadPanel({ theme }: Themed) {
    return <Label
        theme={theme}
        text='Upload'
    />;
}
