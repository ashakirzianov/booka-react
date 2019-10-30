import { AppAction } from './app';

export type ControlsVisibilityState = boolean;
export type ToggleControlsAction = {
    type: 'controls-toggle',
};
export type ControlsVisibilityAction = ToggleControlsAction;

export function controlsVisibilityReducer(state: ControlsVisibilityState = true, action: AppAction) {
    switch (action.type) {
        case 'controls-toggle':
            return !state;
        default:
            return state;
    }
}
