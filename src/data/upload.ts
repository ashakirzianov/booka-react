import { Api } from './api';

export function uploadProvider(api: Api) {
    return {
        uploadBook(bookData: any, publicDomain: boolean) {
            return api.uploadBook(bookData, publicDomain);
        },
    };
}
