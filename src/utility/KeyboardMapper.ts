import { KeyboardAction } from './KeyboardAction';

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
  private stateActions: { [state: number]: KeyboardAction[] };

  private ALT_KEY: number = 18;
  private SHIFT_KEY: number = 16;
  private CTRL_KEY: number = 17;

  /**
   *   Creates a new KeyboardMapper instance.
   */
  constructor() {
    this.stateActions = {};
    this.keyboard = [];
    for (let i: number = 0; i < 256; i++) {
      this.keyboard[i] = false;
    }

    document.addEventListener('keydown', this.keydown.bind(this), false);
    document.addEventListener('keyup', this.keyup.bind(this), false);
  }

  /**
   * Invokes needed action handlers based on the pressed keys.
   * @remarks Only handlers assigned to the given state are processed
   * @param currentState - the state for which hanlders are processed
   */
  public update(currentState: State) {
    //  state specific handler
    let actions: KeyboardAction[] = this.stateActions[currentState];
    this.findHandlerAndInvoke(actions);

    //  global handlers
    actions = this.stateActions[State.GLOBAL];
    this.findHandlerAndInvoke(actions);
  }

  /**
   * Adds an action handler scoped to the given state.
   * @remarks The handler is invoked only if the `state` is active (current)
   */
  public addKeyboardActionHandler = (action: KeyboardAction, state: State) => {
    if (!this.stateActions[state]) {
      this.stateActions[state] = [];
    }
    this.stateActions[state].push(action);
  };

  /** Checks if a key is pressed */
  public isKeyDown(keyCode: number) {
    return this.keyboard[keyCode];
  }

  /**
   *   Searches for all keyboard handlers with matching current pressed key combinations and invokes them.
   */
  private findHandlerAndInvoke(actions: KeyboardAction[]) {
    if (actions) {
      const len = actions.length;
      for (let i: number = 0; i < len; i++) {
        const ka = actions[i];
        if (
          ka &&
          ka.isAssigned() &&
          ka.handler &&
          this.keyboard[ka.key] &&
          this.keyboard[this.ALT_KEY] === ka.altKey &&
          this.keyboard[this.SHIFT_KEY] === ka.shiftKey &&
          this.keyboard[this.CTRL_KEY] === ka.ctrlKey
        ) {
          ka.handler();
          if (ka.releaseKeyAfterInvoke) {
            this.keyboard[ka.key] = false;
          }
        }
      }
    }
  }

  private keydown(e: KeyboardEvent) {
    this.keyboard[e.which] = true;
  }

  private keyup(e: KeyboardEvent) {
    this.keyboard[e.which] = false;
  }
}

export enum State {
  GLOBAL,
  MENU,
  IN_GAME,
  CUSTOM1,
  CUSTOM2,
  CUSTOM3,
  CUSTOM4,
  CUSTOM5,
}
