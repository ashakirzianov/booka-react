import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppAction, AppEpic, ofAppType } from './app';
import { of } from 'rxjs';

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

const requestUploadEpic: AppEpic = (action$, state$, { dataProvider }) => action$.pipe(
    ofAppType('upload-req-upload'),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
        if (state.upload.state === 'selected') {
            const { data, fileName } = state.upload;
            return dataProvider().uploadEpub(data, action.payload.publicDomain).pipe(
                map((bookId): AppAction => ({
                    type: 'upload-success',
                    payload: { fileName, bookId },
                })),
            );
        } else {
            return of<AppAction>();
        }
    }),
);

export const uploadEpic = combineEpics(
    requestUploadEpic,
);
