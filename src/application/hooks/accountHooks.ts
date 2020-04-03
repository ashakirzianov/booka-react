import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './reduxHooks';
import { doFbLogout } from '../facebookSdk';

export function useAccount() {
    const accountState = useAppSelector(s => s.account);
    const dispatch = useAppDispatch();
    const logout = useCallback(() => {
        dispatch({
            type: 'account-logout',
        });
        doFbLogout();
    }, [dispatch]);
    return { accountState, logout };
}
