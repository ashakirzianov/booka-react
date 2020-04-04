import React, { useRef, useState } from 'react';
import { useTheme, useUpload, useAccount } from '../application';
import {
    IconButton, WithPopover, Label, View, ActionButton, CheckBox,
    regularSpace, SelectFileDialog, SelectFileDialogRef, SelectFileResult,
    point, doubleSpace, megaSpace, ActivityIndicator,
} from '../controls';
import { Themed } from '../core';
import { assertNever } from '../reader/RichText/utils';
import { LoginOptions } from './LoginOptions';

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
    state: 'not-signed',
} | {
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
} | {
    state: 'error',
    fileName: string,
};
function UploadPanel({ theme }: Themed) {
    const { uploadEpub } = useUpload();
    const { accountState } = useAccount();
    const [state, setState] = useState<UploadState>(
        accountState.state === 'signed'
            ? { state: 'select' }
            : { state: 'not-signed' },
    );

    switch (state.state) {
        case 'not-signed':
            return <NotSignedPanel
                theme={theme}
            />;
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
                    uploadEpub(state.fileName, data, pd);
                    setState({
                        state: 'uploading',
                        fileName: state.fileName,
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
