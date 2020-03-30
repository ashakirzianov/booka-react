import React, { useRef } from 'react';
import { useTheme } from '../application';
import {
    IconButton, WithPopover, Label, View, ActionButton,
    normalPadding, SelectFileDialog, SelectFileDialogRef,
} from '../controls';
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
    const dialogRef = useRef<SelectFileDialogRef>();
    return <View style={{
        alignItems: 'center',
        padding: normalPadding,
    }}>
        <SelectFileDialog
            accept='application/epub+zip'
            dataKey='book'
            refCallback={r => dialogRef.current = r}
            onFilesSelected={async data => {
                return undefined;
            }}
        />
        <Label
            theme={theme}
            text={`Select '.epub' file to upload`}
        />
        <ActionButton
            theme={theme}
            color='positive'
            text='Select'
            callback={() => {
                if (dialogRef.current) {
                    dialogRef.current.show();
                }
            }}
        />
    </View>;
}
