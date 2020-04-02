import { useMemo } from 'react';
import { rangeFromString } from 'booka-common';
import { useQuery, useUrlActions } from './urlHooks';

export function useQuote() {
    const { q } = useQuery();
    const { updateQuoteRange } = useUrlActions();
    const quote = useMemo(
        () => typeof q === 'string' ? rangeFromString(q) : undefined,
        [q],
    );
    return { quote, updateQuoteRange };
}
