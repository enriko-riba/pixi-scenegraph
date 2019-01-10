export class Dictionary<T> {
    private _values: { [key: string]: T; } = {};
    private _keys: string[] = [];

    public get(key: string): T {
        return this._values[key];        
    }

    public contains(key: string): boolean {
        return key in this._values;
    }

    public remove(key: string) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        delete this._values[key];
    }

    public set(key: string, value: T) {
        if (!(key in this._values)) {
            this._keys.push(key);
        }
        this._values[key] = value;
    }

    public get keys(): string[] {
        return this._keys;
    }

    public getAll(): { [key: string]: T; } {
        return this._values;
    }

    public getSet(key: string, valueGetter: () => T): T;
    public getSet(key: string, value: T): T;
    public getSet(key: string, valueOrvalueGetter: any): T {
        if (!this.contains(key)) {
            this.set(key, typeof valueOrvalueGetter == 'function' ? valueOrvalueGetter() : valueOrvalueGetter);
        }
        return this.get(key);
    }

    public clear() {
        this._keys = [];
        this._values = {};
    }
}
