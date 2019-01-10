import { State } from "./SceneManager";
/**
*   Simple keyboard mapper.
*/
export declare class KeyboardMapper {
    /**
     *   Stores keyboard pressed state.
     */
    private keyboard;
    /**
     *   Stores an array of KeyboardAction instances per Global.State. The 'state' indexer is a numeric value from the Global.State enum.
     */
    private stateActions;
    private ALT_KEY;
    private SHIFT_KEY;
    private CTRL_KEY;
    /**
     *   Creates a new KeyboardMapper instance.
     */
    constructor();
    update(currentState: State): void;
    /**
     *   Searches for all keyboard handlers with matching current pressed key combinations and invokes them.
     */
    private findHandlerAndInvoke(actions);
    private keydown(e);
    private keyup(e);
    addKeyboardActionHandler: (action: KeyboardAction, state: State) => void;
    isKeyDown(keyCode: number): boolean;
}
export declare class KeyboardAction {
    key: number;
    name: string;
    handler: KeyboardActionCallback | undefined;
    releaseKeyAfterInvoke: boolean;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    /**
    *   Returns true if the handler is assigned.
    */
    isAssigned(): boolean;
    /**
    *   Creates a new KeyboardAction instance.
    */
    constructor(key: number, name: string, handler?: KeyboardActionCallback | undefined, releaseKeyAfterInvoke?: boolean, shiftKey?: boolean, ctrlKey?: boolean, altKey?: boolean);
}
export interface KeyboardActionCallback {
    (): void;
}
