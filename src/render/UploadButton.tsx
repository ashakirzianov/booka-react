import React from 'react';
import { useTheme } from '../application';
import { IconButton, WithPopover, Label, View, ActionButton, normalPadding } from '../controls';
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
    return <View style={{
        alignItems: 'center',
        padding: normalPadding,
    }}>
        <Label
            theme={theme}
            text={`Select '.epub' file to upload`}
        />
        <ActionButton
            theme={theme}
            color='positive'
            text='Select'
        />
    </View>;
}
