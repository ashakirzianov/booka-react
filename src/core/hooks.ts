import { useSelector, useDispatch } from "react-redux";
import { AppState, AppAction } from "../model";

export function useAppSelector<T>(selector: (state: AppState) => T) {
    return useSelector(selector);
}

export function useAppDispatch() {
    return useDispatch<AppAction>();
}
