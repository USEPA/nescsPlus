import {Injectable} from '@angular/core';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';
import {Subject} from 'rxjs';
import {HelperService} from './helper.service';

@Injectable()
export class AdvancedQueryService {
  constructor(private helper: HelperService) {
  }

  private pushNavigationChange = new Subject<Array<ListItem>>();
  pushNavigationChange$ = this.pushNavigationChange.asObservable();
  private listChange = new Subject<boolean>();
  listChange$ = this.listChange.asObservable();
  private activeFilterChange = new Subject<string>();
  activeFilterChange$ = this.activeFilterChange.asObservable();


  listClick(value: boolean) {
    this.listChange.next(value);
  }

  processClick(value: Array<ListItem>) {
    this.pushNavigationChange.next(value);
  }

  pushActiveFilterChange(activeFilter: string) {
    this.activeFilterChange.next(activeFilter);
  }

  prepDisplay(fields: Array<string>, dataGroup: string): any {
    const rawData = JSON.parse(localStorage.getItem(dataGroup));
    const options = {
      columns: [],
      data: null
    };
    options.data = rawData;
    // Remove fields
    if (fields) {
      // Modify Custom display
      fields.forEach((column) => {
        const columnIndex = options.data[0].indexOf(column);
        const tempArray = options.data.map((item) => {
          item.splice(columnIndex, 1);
          return item;
        });
        options.data = tempArray;
      });
    }

    options.data[0].forEach((column) => {
      let visible = true;
      const columnTitle = this.findColumnItem(column);
      try {
        if ((fields && fields.indexOf(column) === -1) || columnTitle[2] === 'FESCS Code') {
          visible = false;
        }
        options.columns.push({
          title: columnTitle[2],
          originalTitle: column,
          visible: visible
        });
      } catch (e) {
        alert('column:' + column + ' missing? error:' + e.toString());
      }
    });
    return options;
  }

  findColumnItem(column) {
    return Constants.COLUMN_MAP.find((element, index, array) => {
      return element[1] === column;
    });
  }

  getAdvancedQueryNav(): Array<ListItem> {
    const returnResult = new Array<ListItem>();
    Constants.NAV_ARRAY.forEach((item) => {
      const dataItem = JSON.parse(localStorage.getItem(item.dataPoint));
      returnResult.push(new ListItem({
        column: item.name.replace(' ', '_'),
        title: item.name,
        children: this.filterArray(dataItem, item.keys),
        checked: true
      }));
    });
    return returnResult;
  }

  private filterArray(data: Array<any>, keys: Array<string>): Array<any> {
    switch (keys.length) {
      case 1:
        return this.filterArray0(data, keys);
      case 2:
        const first2 = this.filterArray0(data, keys);
        first2.forEach((item) => {
          item.children = this.filterSecond(data, keys, item.title);
        });
        return first2;
      case 3:
        const first3 = this.filterArray0(data, keys);
        first3.forEach((item) => {
          item.children = this.filterSecond(data, keys, item.title);
        });
        first3.forEach((item) => {
          item.children.forEach((second2) => {
            second2.children = this.filterThird(data, keys, item.title, second2.title);
          });
        });
        return first3;
    }
  }

  private filterArray0(data: Array<any>, keys: Array<string>): any {
    const first = [...new Set(data.map(item => item[keys[0]]))];

    return first.map((item) => {
      return new ListItem({title: item || '', column: item.replace(/\s/g, '_'), children: [], checked: true});
    });
  }

  private filterSecond(data: Array<any>, keys: Array<string>, firstLevel: string): any {
    const second = [...new Set(data.map((item) => {
      const temp = item[keys[1]][0];
      if (item[keys[0]] === firstLevel && typeof temp !== 'undefined') {
        return item[keys[1]];
      }
    }))];

    return this.returnListItem(second);
  }

  private filterThird(data: Array<any>, keys: Array<string>, firstLevel: string, secondLevel: string): any {
    const third = [...new Set(data.map((item) => {
      if (item[keys[0]] === firstLevel && item[keys[1]] === secondLevel && item[keys[2]]) {
        return item[keys[2]];
      }
    }))];

    return this.returnListItem(third);
  }

  private returnListItem(items) {
    items = this.helper.remove(items, row => row !== undefined);
    return items.map((item) => {
      return new ListItem({title: item[0], column: item[0].replace(/\s/g, '_').toLowerCase(), children: [], checked: true});
    });
  }


}
