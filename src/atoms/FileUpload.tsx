import * as React from 'react';

export type Data = { data: any };
export type FileUploadDialogRef = {
    show: () => void,
};
export type FileUploadDialogProps = {
    accept?: string,
    dataKey: string,
    refCallback: (ref: FileUploadDialogRef) => void,
    onFilesSelected: (data: Data) => void,
};
export function FileUploadDialog({
    refCallback, onFilesSelected,
    dataKey, accept,
}: FileUploadDialogProps) {
    return <input
        accept={accept}
        style={{ display: 'none' }}
        ref={r => refCallback({ show: () => r && r.click() })}
        type='file'
        onChange={e => {
            const file = e.target.files && e.target.files[0];
            if (file) {
                const data = new FormData();
                data.append(dataKey, file);
                onFilesSelected({ data });
            }
        }}
    />;
}
