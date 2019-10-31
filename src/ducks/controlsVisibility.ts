import { AppAction } from './app';

// TODO: merge into 'book'
export type ControlsVisibilityState = boolean;
export type ToggleControlsAction = {
    type: 'controls-toggle',
};
export type ControlsVisibilityAction = ToggleControlsAction;

export function controlsVisibilityReducer(state: ControlsVisibilityState = false, action: AppAction) {
    switch (action.type) {
        case 'controls-toggle':
            return !state;
        default:
            return state;
    }
}
