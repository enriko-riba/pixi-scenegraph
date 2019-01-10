import { State } from "./SceneManager";

/**
*   Simple keyboard mapper.
*/
export class KeyboardMapper {

    /**
     *   Stores keyboard pressed state.
     */
    private keyboard: boolean[];

    /**
     *   Stores an array of KeyboardAction instances per Global.State. The 'state' indexer is a numeric value from the Global.State enum.
     */
    private stateActions: { [state: number]: KeyboardAction[]; };

    private ALT_KEY: number = 18;
    private SHIFT_KEY: number = 16;
    private CTRL_KEY: number = 17;


    /**
     *   Creates a new KeyboardMapper instance.
     */
    constructor() {
        this.stateActions = {};
        this.keyboard = [];
        for (var i: number = 0; i < 256; i++) { this.keyboard[i] = false; }

        document.addEventListener('keydown', this.keydown.bind(this), false);
        document.addEventListener('keyup', this.keyup.bind(this), false);
    }

    /*
     *   Invokes needed action handlers based on the pressed keys.
     */
    public update(currentState: State) {

        //  state specific handler
        var actions: KeyboardAction[] = this.stateActions[currentState];
        this.findHandlerAndInvoke(actions);


        //  global handlers
        actions = this.stateActions[State.GLOBAL];
        this.findHandlerAndInvoke(actions);
    }

    /**
     *   Searches for all keyboard handlers with matching current pressed key combinations and invokes them.
     */
    private findHandlerAndInvoke(actions: KeyboardAction[]) {
        if (actions) {
            var len = actions.length;
            for (var i: number = 0; i < len; i++) {
                var ka = actions[i];
                if (ka && ka.isAssigned() && ka.handler
                    && this.keyboard[ka.key]
                    && this.keyboard[this.ALT_KEY] == ka.altKey
                    && this.keyboard[this.SHIFT_KEY] == ka.shiftKey
                    && this.keyboard[this.CTRL_KEY] == ka.ctrlKey) {
                    ka.handler();
                    if (ka.releaseKeyAfterInvoke) this.keyboard[ka.key] = false;
                }
            }
        }
    }

    private keydown(e:KeyboardEvent) {
        this.keyboard[e.which] = true;
    }

    private keyup(e:KeyboardEvent) {
        this.keyboard[e.which] = false;
    }

    public addKeyboardActionHandler = (action: KeyboardAction, state: State) => {
        if (!this.stateActions[state]) this.stateActions[state] = [];
        this.stateActions[state].push(action);
    }

    public isKeyDown(keyCode: number) {
        return this.keyboard[keyCode];
    }
}


export class KeyboardAction {

    /**
    *   Returns true if the handler is assigned.
    */
    public isAssigned(): boolean {
        return this.handler !== undefined;
    }

    /**
    *   Creates a new KeyboardAction instance.
    */
    constructor(
        public key: number,
        public name: string,
        public handler: KeyboardActionCallback | undefined = undefined,
        public releaseKeyAfterInvoke: boolean = true,
        public shiftKey: boolean = false,
        public ctrlKey: boolean = false,
        public altKey: boolean = false) {
    }
}

export interface KeyboardActionCallback {
    (): void;
}
