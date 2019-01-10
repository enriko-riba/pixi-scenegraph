export declare class LinkedList<T> {
    private first;
    private last;
    private length;
    First: LinkedListNode<T> | null;
    Last: LinkedListNode<T> | null;
    readonly Length: number;
    AddNode: (data: T) => LinkedListNode<T>;
    InsertNode: (data: T) => LinkedListNode<T>;
    RemoveNode(node: LinkedListNode<T>): void;
    RollLeft(): void;
    forEach(callback: (node: LinkedListNode<T>) => void): void;
}
export declare class LinkedListNode<T> {
    previous: LinkedListNode<T> | null;
    next: LinkedListNode<T> | null;
    data: boolean;
    T: any;
    list: boolean;
    LinkedList<T>(): any;
    InsertBefore(data: T): void;
    InsertAfter(data: T): void;
    FindFirst(): LinkedListNode<T>;
    FindLast(): LinkedListNode<T>;
}
