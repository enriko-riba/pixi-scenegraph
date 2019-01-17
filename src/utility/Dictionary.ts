export  type valueGetter<T> = ()=> T;

export class Dictionary<T> {
  private dictValues: { [key: string]: T } = {};
  private dictKeys: string[] = [];

  public get(key: string): T {
    return this.dictValues[key];
  }

  public contains(key: string): boolean {
    return key in this.dictValues;
  }

  public remove(key: string) {
    const index = this.dictKeys.indexOf(key, 0);
    this.dictKeys.splice(index, 1);
    delete this.dictValues[key];
  }

  public set(key: string, value: T) {
    if (!(key in this.dictValues)) {
      this.dictKeys.push(key);
    }
    this.dictValues[key] = value;
  }

  public get keys(): string[] {
    return this.dictKeys;
  }

  public getAll(): { [key: string]: T } {
    return this.dictValues;
  }

  public getSet(key: string, valueOrvalueGetter: T | valueGetter<T>): T {
    if (!this.contains(key)) {
      this.set(key, typeof valueOrvalueGetter === 'function' ? (valueOrvalueGetter as any)() : valueOrvalueGetter);
    }
    return this.get(key);
  }

  public clear() {
    this.dictKeys = [];
    this.dictValues = {};
  }
}
