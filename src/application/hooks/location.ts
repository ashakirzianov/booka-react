import { useAppCallback, useAppSelector } from './redux';

export function useAppLocation() {
    return useAppSelector(s => s.location);
}

export function useNavigate() {
    return useAppCallback('location-navigate');
}

export function useSearch() {
    return useAppSelector(s => s.search);
}

export function useDoLibraryQuery() {
    return useAppCallback('location-update-search');
}

export function useSetCard() {
    return useAppCallback('location-update-card');
}

export function useSetQuote() {
    return useAppCallback('location-update-quote');
}

export function useSetPath() {
    return useAppCallback('location-update-path');
}

export function useSetTocOpen() {
    return useAppCallback('location-update-toc');
}
