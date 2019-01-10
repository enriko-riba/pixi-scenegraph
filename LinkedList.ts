import { LinkedListNode } from './LinkedListNode';

export class LinkedList<T> {
  private first: LinkedListNode<T> | null = null;
  private last: LinkedListNode<T> | null = null;
  private length: number = 0;

  public get First(): LinkedListNode<T> | null {
    return this.first;
  }
  public set First(node: LinkedListNode<T> | null) {
    this.first = node;
  }

  public get Last(): LinkedListNode<T> | null {
    return this.last;
  }
  public set Last(node: LinkedListNode<T> | null) {
    this.last = node;
  }

  public get Length(): number {
    return this.length;
  }

  public AddNode = (data: T): LinkedListNode<T> => {
    const newLastNode = new LinkedListNode<T>();
    newLastNode.data = data;
    newLastNode.previous = newLastNode.next = null;
    newLastNode.list = this;
    if (!this.first) {
      this.first = newLastNode;
      this.last = newLastNode;
    } else {
      newLastNode.previous = this.last;
      this.last!.next = newLastNode;
      this.last = newLastNode;
    }
    this.length++;
    return newLastNode;
  };

  public InsertNode = (data: T): LinkedListNode<T> => {
    const newFirstNode = new LinkedListNode<T>();
    newFirstNode.data = data;
    newFirstNode.previous = newFirstNode.next = null;
    newFirstNode.list = this;
    if (!this.first) {
      this.first = newFirstNode;
      this.last = newFirstNode;
    } else {
      newFirstNode.next = this.first;
      this.first.previous = newFirstNode;
      this.first = newFirstNode;
    }
    this.length++;
    return newFirstNode;
  };

  public RemoveNode(node: LinkedListNode<T>) {
    if (node.previous) {
      node.previous.next = node.next;
    }
    if (node.next) {
      node.next.previous = node.previous;
    }
    this.length--;
  }

  public RollLeft() {
    const last = this.first;
    const second = this.first!.next;
    last!.next = null;
    last!.previous = this.last;
    this.last!.next = last;
    this.last = last;

    this.first = second;
    this.first!.previous = null;
  }

  public forEach(callback: (node: LinkedListNode<T>) => void) {
    let node = this.first;
    while (node) {
      callback(node);
      node = node.next;
    }
  }
}
