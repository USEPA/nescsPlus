import {Injectable} from '@angular/core';
import {Constants} from '../models/constants';
import {Subject} from 'rxjs';
import {ListItem} from '../models/listItem';

@Injectable({
  providedIn: 'root'
})
export class ToggleColumnsService {
  private toggleColumnChange = new Subject<Set<ListItem>>();
  toggleColumnChange$ = this.toggleColumnChange.asObservable();
  private signalColumnChange = new Subject<boolean>();
  signalColumnChange$ = this.signalColumnChange.asObservable();

  constructor() {
  }

  getColumnToggleHideList(): Set<ListItem> {
    let columnToggleHideList = JSON.parse(localStorage.getItem('ColumnToggleHideList'));
    if (!columnToggleHideList) {
      columnToggleHideList = Constants.TOGGLE_COLUMN_MAP;
    }
    return columnToggleHideList;
  }

  saveColumnFilterOptions(data: Set<ListItem>): void {
    localStorage.setItem('ColumnToggleHideList', JSON.stringify(data));
  }

  listClick(value: boolean): void {
    this.signalColumnChange.next(value);
  }

  processClick(values: Set<ListItem>): void {
    this.toggleColumnChange.next(values);
  }
}
