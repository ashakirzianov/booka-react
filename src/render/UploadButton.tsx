import React, { useRef, useState, useCallback } from 'react';
import { useTheme, useUpload } from '../application';
import {
    IconButton, WithPopover, Label, View, ActionButton, CheckBox,
    regularSpace, SelectFileDialog, SelectFileDialogRef, SelectFileResult,
    point, doubleSpace, megaSpace,
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

function UploadPanel({ theme }: Themed) {
    const [fileData, setFileData] = useState<SelectFileResult | undefined>(undefined);

    return <View style={{
        alignItems: 'center',
        padding: regularSpace,
        width: point(20),
    }}>
        {
            fileData
                ? <UploadFilePanel
                    theme={theme}
                    fileData={fileData}
                />
                : <SelectFilePanel
                    theme={theme}
                    onSelect={setFileData}
                />
        }

    </View>;
}

function SelectFilePanel({ theme, onSelect }: Themed & {
    onSelect: (fileData: SelectFileResult) => void,
}) {
    const dialogRef = useRef<SelectFileDialogRef>();

    return <>
        <SelectFileDialog
            accept='application/epub+zip'
            dataKey='book'
            refCallback={r => dialogRef.current = r}
            onFilesSelected={onSelect}
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
    </>;
}

function UploadFilePanel({ theme, fileData }: Themed & {
    fileData: SelectFileResult,
}) {
    const { uploadEpub } = useUpload();
    const [isPublicDomain, setIsPublicDomain] = useState(true);
    const uploadCallback = useCallback(
        () => uploadEpub(fileData.data, isPublicDomain),
        [uploadEpub, isPublicDomain, fileData],
    );
    return <>
        <Label
            theme={theme}
            text={`Upload '${fileData.fileName}'`}
        />
        <View style={{
            margin: doubleSpace,
            marginLeft: megaSpace,
        }}>
            <CheckBox
                theme={theme}
                checked={isPublicDomain}
                text='This book is in the Public Domain'
                onChange={() => setIsPublicDomain(!isPublicDomain)}
            />
        </View>
        <ActionButton
            theme={theme}
            color='positive'
            text='Upload'
            callback={uploadCallback}
        />
    </>;
}
