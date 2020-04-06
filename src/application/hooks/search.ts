import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';

export function useSearch() {
    return useAppSelector(s => s.search);
}

export function useDoLibraryQuery() {
    const dispatch = useAppDispatch();
    return useCallback((query: string | undefined) => {
        console.log(query);
        dispatch({
            type: 'location-update',
            payload: { location: 'feed', search: query },
        });
    }, [dispatch]);
}
