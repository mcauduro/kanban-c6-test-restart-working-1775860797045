/**
 * A collection of classic sorting algorithm implementations.
 * All methods operate on arrays of numbers and return new sorted arrays (immutable).
 *
 * @example
 * const sorter = new SortingAlgorithms();
 * console.log(sorter.quickSort([3, 1, 2])); // [1, 2, 3]
 */
export class SortingAlgorithms {
  /**
   * Sorts an array using the Bubble Sort algorithm.
   * Time complexity: O(n²) average and worst case.
   *
   * @param {number[]} arr - The array to sort.
   * @returns {number[]} A new sorted array.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.bubbleSort([5, 3, 1, 4, 2])); // [1, 2, 3, 4, 5]
   */
  bubbleSort(arr: number[]): number[] {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    return a;
  }

  /**
   * Sorts an array using the Merge Sort algorithm (divide and conquer).
   * Time complexity: O(n log n) guaranteed.
   *
   * @param {number[]} arr - The array to sort.
   * @returns {number[]} A new sorted array.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.mergeSort([8, 3, 5, 1])); // [1, 3, 5, 8]
   */
  mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));
    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    }
    return result.concat(left.slice(i), right.slice(j));
  }

  /**
   * Sorts an array using the Quick Sort algorithm.
   * Time complexity: O(n log n) average, O(n²) worst case.
   *
   * @param {number[]} arr - The array to sort.
   * @returns {number[]} A new sorted array.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.quickSort([3, 6, 8, 10, 1, 2, 1])); // [1, 1, 2, 3, 6, 8, 10]
   */
  quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
  }

  /**
   * Sorts an array using the Insertion Sort algorithm.
   * Time complexity: O(n²) average, O(n) best (nearly sorted input).
   *
   * @param {number[]} arr - The array to sort.
   * @returns {number[]} A new sorted array.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.insertionSort([4, 2, 1, 3])); // [1, 2, 3, 4]
   */
  insertionSort(arr: number[]): number[] {
    const a = [...arr];
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
    }
    return a;
  }

  /**
   * Sorts an array using the Heap Sort algorithm.
   * Time complexity: O(n log n) guaranteed; in-place.
   *
   * @param {number[]} arr - The array to sort.
   * @returns {number[]} A new sorted array.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.heapSort([9, 4, 3, 8, 10, 2, 5])); // [2, 3, 4, 5, 8, 9, 10]
   */
  heapSort(arr: number[]): number[] {
    const a = [...arr];
    const n = a.length;
    const heapify = (size: number, i: number) => {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && a[l] > a[largest]) largest = l;
      if (r < size && a[r] > a[largest]) largest = r;
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        heapify(size, largest);
      }
    };
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      heapify(i, 0);
    }
    return a;
  }

  /**
   * Performs a binary search on a sorted array.
   * Time complexity: O(log n).
   *
   * @param {number[]} sortedArr - A sorted array to search in.
   * @param {number} target - The target value to find.
   * @returns {number} The index of the target, or -1 if not found.
   *
   * @example
   * const sorter = new SortingAlgorithms();
   * console.log(sorter.binarySearch([1, 3, 5, 7, 9], 5)); // 2
   * console.log(sorter.binarySearch([1, 3, 5], 4)); // -1
   */
  binarySearch(sortedArr: number[], target: number): number {
    let lo = 0, hi = sortedArr.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedArr[mid] === target) return mid;
      if (sortedArr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
}
