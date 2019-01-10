export declare class Dictionary<T> {
  private _values;
  private _keys;
  get(key: string): T;
  contains(key: string): boolean;
  remove(key: string): void;
  set(key: string, value: T): void;
  readonly keys: string[];
  getAll(): {
    [key: string]: T;
  };
  getSet(key: string, valueGetter: () => T): T;
  getSet(key: string, value: T): T;
  clear(): void;
}
