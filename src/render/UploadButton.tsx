import React, { useRef, useState } from 'react';
import { assertNever } from 'booka-common';
import { useTheme, useUploadEpub } from '../application';
import {
    IconButton, Label, View, ActionButton, CheckBox,
    SelectFileDialog, SelectFileDialogRef, SelectFileResult,
    doubleSpace, megaSpace, ActivityIndicator, WithPopover, point,
} from '../controls';
import { Themed } from '../core';
import { LoginOptions } from './LoginOptions';
import { Observable } from 'rxjs';
import { BookPathLink } from '../views';

type UploadState = {
    state: 'not-signed',
} | {
    state: 'empty',
} | {
    state: 'selected',
    fileName: string,
    data: any,
} | {
    state: 'uploading',
    fileName: string,
} | {
    state: 'success',
    fileName: string,
    bookId: string,
} | {
    state: 'error',
    fileName: string,
};
export function UploadButton() {
    const theme = useTheme();
    const [state, setState] = useState<UploadState>({ state: 'empty' });
    const uploadEpub = useUploadEpub();

    return <WithPopover
        theme={theme}
        placement='bottom'
        body={<View style={{
            alignItems: 'center',
            width: point(14),
            margin: doubleSpace,
        }}>
            <UploadPanel
                theme={theme}
                state={state}
                setState={setState}
                uploadEpub={uploadEpub}
            />
        </View>}
    >
        <IconButton
            theme={theme}
            icon='upload'
        />
    </WithPopover>;
}
function UploadPanel({
    theme, uploadEpub, state, setState,
}: Themed & {
    state: UploadState,
    setState: (state: UploadState) => void,
    uploadEpub: (data: any, publicDomain: boolean) => Observable<string>,
}) {
    switch (state.state) {
        case 'not-signed':
            return <NotSignedPanel
                theme={theme}
            />;
        case 'empty':
            return <SelectFilePanel
                theme={theme}
                onSelect={res => setState({
                    state: 'selected',
                    fileName: res.fileName,
                    data: res.data,
                })}
            />;
        case 'selected':
            return <UploadFilePanel
                theme={theme}
                fileData={{
                    fileName: state.fileName,
                    data: state.data,
                }}
                upload={(data, pd) => {
                    setState({
                        state: 'uploading',
                        fileName: state.fileName,
                    });
                    uploadEpub(data, pd).subscribe({
                        next: bookId => setState({
                            state: 'success',
                            fileName: state.fileName,
                            bookId,
                        }),
                        error: () => setState({
                            state: 'error',
                            fileName: state.fileName,
                        }),
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
                bookId={state.bookId}
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

function SuccessPanel({ theme, fileName, bookId }: Themed & {
    bookId: string,
    fileName: string,
}) {
    return <>
        <Label
            theme={theme}
            text={`Successfully uploaded '${fileName}'!`}
        />
        <BookPathLink bookId={bookId}>
            <ActionButton
                theme={theme}
                text='Read now'
                color='positive'
            />
        </BookPathLink>
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
