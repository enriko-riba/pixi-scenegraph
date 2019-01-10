export type KeyboardActionCallback = () => void;

export class KeyboardAction {
  /**
   *   Creates a new KeyboardAction instance.
   */
  constructor(
    public key: number,
    public name: string,
    public handler?: KeyboardActionCallback,
    public releaseKeyAfterInvoke: boolean = true,
    public shiftKey: boolean = false,
    public ctrlKey: boolean = false,
    public altKey: boolean = false,
  ) {}

  /**
   *   Returns true if the handler is assigned.
   */
  public isAssigned(): boolean {
    return this.handler !== undefined;
  }
}
