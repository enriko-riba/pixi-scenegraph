import { LinkedList } from '..';

export class LinkedListNode<T> {
  public previous: LinkedListNode<T> | null = null;
  public next: LinkedListNode<T> | null = null;
  public data: T;
  public list: LinkedList<T>;

  public InsertBefore(data: T) {
    const node = this.list.AddNode(data);
    const previous = this.previous;
    node.next = this;
    node.previous = previous;
    this.previous = node;
    if (previous) {
      previous.next = node;
    }
    node.list = this.list;
    this.list.First = this.FindFirst();
  }

  public InsertAfter(data: T) {
    const node = this.list.AddNode(data);
    const next = this.next;
    node.previous = this;
    node.next = next;
    this.next = node;
    if (next) {
      next.previous = node;
    }
    node.list = this.list;
    this.list.Last = this.FindLast();
  }

  public FindFirst(): LinkedListNode<T> {
    let node: LinkedListNode<T> = this;
    while (node.previous) {
      node = node.previous;
    }
    return node;
  }

  public FindLast(): LinkedListNode<T> {
    let node: LinkedListNode<T> = this;
    while (node.next) {
      node = node.next;
    }
    return node;
  }
}
