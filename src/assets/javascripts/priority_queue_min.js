// La priorité est un nombre entier positif.
// Plus le nombre est grand, plus la priorité est élevée.
// Adapté pour Dijkstra
export class QueueEventMin {
  constructor(vertex, priority = 0) {
    this.vertex = vertex;
    this.priority = priority;
  }
}

export class Priority_queue_min {
  constructor() {
    this.heap = [];
  }

  insert(event) {
    this.heap.push(event);
    this.heapifyUpIterative();
  }

  heapifyUpIterative() {
    let childIndex = this.heap.length - 1;
    let parentIndex = Math.floor((childIndex - 1) / 2);
    while (childIndex > 0 && this.heap[childIndex].priority < this.heap[parentIndex].priority) {
      this.swap(childIndex, parentIndex);
      childIndex = parentIndex;
      parentIndex = Math.floor((childIndex - 1) / 2);
    }
  }

  extractMin() {
    if (this.isEmpty()) {
      return null;
    }
    const min = this.findMin();
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }
    return min;
  }

  findMin() {
    if (this.isEmpty()) {
      return null;
    }
    return this.heap[0];
  }

  heapifyDown() {
    let parent = 0;
    let left = 1;
    let right = 2;
    const length = this.heap.length;
    while (parent < length && ((left < length && this.heap[left].priority < this.heap[parent].priority) ||
      (right < length && this.heap[right].priority < this.heap[parent].priority))) {
      let min;
      if (right >= length) {
        min = left;
      } else if (this.heap[left].priority < this.heap[right].priority) {
        min = left;
      } else {
        min = right;
      }
      this.swap(parent, min);
      parent = min;
      left = parent * 2 + 1;
      right = parent * 2 + 2;
    }
  }

  swap(i, j) {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  getSize() {
    return this.heap.length;
  }
}
