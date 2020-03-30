import React, { useRef, useState } from 'react';
import { useTheme, useUpload } from '../application';
import {
    IconButton, WithPopover, Label, View, ActionButton, CheckBox,
    regularSpace, SelectFileDialog, SelectFileDialogRef, SelectFileResult,
    point, doubleSpace, megaSpace, ActivityIndicator,
} from '../controls';
import { Themed } from '../core';
import { assertNever } from '../reader/RichText/utils';

export function UploadButton() {
    const { theme } = useTheme();

    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={<View style={{
            alignItems: 'center',
            padding: regularSpace,
            width: point(20),
        }}>
            <UploadPanel
                theme={theme}
            />
        </View>}
    >
        <IconButton
            theme={theme}
            icon='upload'
        />
    </WithPopover>;
}

type UploadState = {
    state: 'select',
} | {
    state: 'upload',
    fileName: string,
    data: any,
} | {
    state: 'uploading',
    fileName: string,
} | {
    state: 'success',
    fileName: string,
};
function UploadPanel({ theme }: Themed) {
    const { uploadEpub } = useUpload();
    const [state, setState] = useState<UploadState>({ state: 'select' });

    switch (state.state) {
        case 'select':
            return <SelectFilePanel
                theme={theme}
                onSelect={res => setState({
                    state: 'upload',
                    fileName: res.fileName,
                    data: res.data,
                })}
            />;
        case 'upload':
            return <UploadFilePanel
                theme={theme}
                fileData={state}
                upload={(data, pd) => {
                    uploadEpub(data, pd).subscribe(() => {
                        setState({
                            ...state,
                            state: 'success',
                        });
                    });
                    setState({
                        ...state,
                        state: 'uploading',
                    });
                }}
            />;
        case 'uploading':
            return <FileUploadingPanel
                theme={theme}
                fileName={state.fileName}
            />;
        case 'success':
            return <SuccessPanel
                theme={theme}
                fileName={state.fileName}
            />;
        default:
            assertNever(state);
            return null;
    }
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

function UploadFilePanel({ theme, fileData, upload }: Themed & {
    fileData: SelectFileResult,
    upload: (bookData: any, publicDomain: boolean) => void,
}) {
    const [isPublicDomain, setIsPublicDomain] = useState(true);
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
            callback={() => upload(fileData.data, isPublicDomain)}
        />
    </>;
}

function FileUploadingPanel({ theme, fileName }: Themed & {
    fileName: string,
}) {
    return <>
        <Label
            theme={theme}
            text={`Uploading '${fileName}'`}
        />
        <ActivityIndicator
            theme={theme}
        />
    </>;
}

function SuccessPanel({ theme, fileName }: Themed & {
    fileName: string,
}) {
    return <>
        <Label
            theme={theme}
            text={`Successfully uploaded '${fileName}'!`}
        />
    </>;
}
