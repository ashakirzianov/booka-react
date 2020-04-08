import { useAppCallback, useAppSelector } from './redux';

export function useAppLocation() {
    return useAppSelector(s => s.location.location);
}

export function useBookId() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.bookId : undefined,
    );
}

export function useNavigate() {
    return useAppCallback('location/navigate');
}

export function useSearch() {
    return useAppSelector(s => s.search);
}

export function useSearchQuery() {
    return useAppSelector(
        s => s.location.location === 'feed'
            ? s.location.search : undefined,
    );
}

export function useDoSearch() {
    return useAppCallback('location/update-search');
}

export function useCardId() {
    return useAppSelector(
        s => s.location.location === 'feed'
            ? s.location.card : undefined,
    );
}

export function useSetCardId() {
    return useAppCallback('location/update-card');
}

export function useQuote() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.quote : undefined,
    );
}

export function useSetQuote() {
    return useAppCallback('location/update-quote');
}

export function useBookPath() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.path : undefined,
    );
}

export function useSetBookPath() {
    return useAppCallback('location/update-path');
}

export function useTocOpen() {
    return useAppSelector(
        s => s.location.location === 'book'
            ? s.location.toc : false,
    );
}

export function useSetTocOpen() {
    return useAppCallback('location/update-toc');
}
