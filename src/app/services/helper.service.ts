import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() {
  }

  static union(setA: Set<any>, setB: Set<any>): Set<any> {
    const unionLocal = new Set(setA);
    setB.forEach((elem) => {
      unionLocal.add(elem);
    });
    return unionLocal;
  }

  static intersection(setA: Set<any>, setB: Set<any>): Set<any> {
    const intersectionLocal = new Set();
    setB.forEach((elem) => {
      if (setA.has(elem)) {
        intersectionLocal.add(elem);
      }
    });
    return intersectionLocal;
  }

  // Remove and return the first occurrence
  removeOne(array, predicate): any {
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        return array.splice(i, 1);
      }
    }
  }

  // Remove and return all occurrences
  remove(array, predicate): any {
    const removed = [];
    for (let i = 0; i < array.length;) {
      if (predicate(array[i])) {
        removed.push(array.splice(i, 1));
        continue;
      }
      i++;
    }

    return removed;
  }
}
