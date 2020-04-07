import React, { useRef, useState } from 'react';
import { assertNever } from 'booka-common';
import { useTheme, useUpload } from '../application';
import {
    IconButton, WithPopover, Label, View, ActionButton, CheckBox,
    regularSpace, SelectFileDialog, SelectFileDialogRef, SelectFileResult,
    point, doubleSpace, megaSpace, ActivityIndicator,
} from '../controls';
import { Themed } from '../core';
import { UploadState } from '../ducks';
import { LoginOptions } from './LoginOptions';

export function UploadButton() {
    const theme = useTheme();
    const { uploadState, uploadEpub, selectFile } = useUpload();

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
                state={uploadState}
                doUpload={uploadEpub}
                selectFile={selectFile}
            />
        </View>}
    >
        <IconButton
            theme={theme}
            icon='upload'
        />
    </WithPopover>;
}

function UploadPanel({ theme, state, doUpload, selectFile }: Themed & {
    state: UploadState,
    doUpload: (publicDomain: boolean) => void,
    selectFile: (fileName: string, data: any) => void,
}) {
    switch (state.state) {
        case 'not-signed':
            return <NotSignedPanel
                theme={theme}
            />;
        case 'empty':
            return <SelectFilePanel
                theme={theme}
                onSelect={res => selectFile(res.fileName, res.data)}
            />;
        case 'selected':
            return <UploadFilePanel
                theme={theme}
                fileData={{
                    fileName: state.fileName,
                    data: state.data,
                }}
                upload={(data, publicDomain) => doUpload(publicDomain)}
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
        case 'error':
            return <ErrorPanel
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

function ErrorPanel({ theme, fileName }: Themed & {
    fileName: string,
}) {
    return <>
        <Label
            theme={theme}
            text={`Error uploading '${fileName}'!`}
        />
    </>;
}

function NotSignedPanel({ theme }: Themed) {
    return <>
        <Label
            theme={theme}
            text='Sign in to upload'
        />
        <LoginOptions
            theme={theme}
        />
    </>;
}
