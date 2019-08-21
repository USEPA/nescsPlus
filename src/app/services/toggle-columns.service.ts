import {Injectable} from '@angular/core';
import {Constants} from '../models/constants';
import {Subject} from 'rxjs';
import {ListItem} from '../models/listItem';

@Injectable({
  providedIn: 'root'
})
export class ToggleColumnsService {
  private toggleColumnChange = new Subject<Array<string>>();
  toggleColumnChange$ = this.toggleColumnChange.asObservable();
  private signalColumnChange = new Subject<boolean>();
  signalColumnChange$ = this.signalColumnChange.asObservable();

  constructor() {
  }

  getColumnToggleHideList(): Array<ListItem> {
    let columnToggleHideList = JSON.parse(localStorage.getItem('ColumnToggleHideList'));
    if (!columnToggleHideList) {
      columnToggleHideList = Constants.TOGGLE_COLUMN_MAP;
    }
    return columnToggleHideList;
  }

  saveColumnFilterOptions(data: Array<ListItem>): void {
    localStorage.setItem('ColumnToggleHideList', JSON.stringify(data));
  }

  listClick(value: boolean): void {
    this.signalColumnChange.next(value);
  }

  processClick(values: Array<ListItem>): void {
    console.log(values);
    const results = this.extractColumns(values);
    this.toggleColumnChange.next(results);
  }

  extractColumns(values: Array<ListItem>): Array<string> {
    let results = new Array<string>();
    values.forEach((item) => {
      if (!item.checked) {
        results.push(item.title);
      }

      if (item.children && item.children.length) {
        const tempList = this.extractColumns(item.children);
        if (tempList) {
          console.log('results,tempList', results, tempList);
          results = results.concat(tempList);
          console.log('results', results);
        }
      }
    });
    return results;
  }
}
