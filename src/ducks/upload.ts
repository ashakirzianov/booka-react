import { mergeMap, map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppAction, AppEpic, ofAppType } from './app';

type UploadSelectFileAction = {
    type: 'upload-select-file',
    payload: {
        fileName: string,
        data: any,
    },
};
type UploadRequestUploadAction = {
    type: 'upload-req-upload',
    payload: {
        fileName: string,
        data: any,
        publicDomain: boolean,
    },
};
type UploadSuccessAction = {
    type: 'upload-success',
    payload: {
        fileName: string,
        bookId: string,
    },
};
type UploadErrorAction = {
    type: 'upload-fail',
    payload: {
        fileName: string,
        error: any,
    },
};
type UploadClearAction = {
    type: 'upload-clear',
};

export type UploadAction =
    | UploadSelectFileAction | UploadRequestUploadAction
    | UploadSuccessAction | UploadErrorAction
    | UploadClearAction
    ;

export type UploadState = {
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

const init: UploadState = { state: 'not-signed' };
export function uploadReducer(state: UploadState = init, action: AppAction): UploadState {
    switch (action.type) {
        case 'upload-select-file':
            return {
                state: 'selected',
                ...action.payload,
            };
        case 'upload-success':
            return {
                state: 'success',
                ...action.payload,
            };
        case 'upload-fail':
            return {
                state: 'error',
                fileName: action.payload.fileName,
            };
        case 'upload-clear':
            return {
                state: 'empty',
            };
        case 'account-receive-info':
            return state.state === 'not-signed'
                ? { state: 'empty' }
                : state;
        default:
            return state;
    }
}

const requestUploadEpic: AppEpic = (action$, _, { getCurrentDataProvider }) => action$.pipe(
    ofAppType('upload-req-upload'),
    mergeMap(action =>
        getCurrentDataProvider().uploadBook(action.payload.data, action.payload.publicDomain).pipe(
            map((bookId): AppAction => ({
                type: 'upload-success',
                payload: {
                    fileName: action.payload.fileName,
                    bookId,
                },
            })),
        ),
    ),
);

export const uploadEpic = combineEpics(
    requestUploadEpic,
);
