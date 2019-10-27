import { useSelector, useDispatch } from "react-redux";
import { AppState, AppAction } from "../model";
import { Dispatch } from "react";

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch() as Dispatch<AppAction>;
}
