import { api } from './api';

export function libraryCard({ bookId }: {
    bookId: string,
}) {
    return api().getLibraryCard(bookId);
}
