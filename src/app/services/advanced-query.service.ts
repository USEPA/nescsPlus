import {Injectable} from '@angular/core';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';
import {Subject} from 'rxjs';
import {HelperService} from './helper.service';
import {Data} from '../models/data.model';
import {NavArray} from '../models/nav-array.model';
import {ActiveFilter} from '../models/enums';
import {HelpItem} from '../models/help-item';
import {Column} from '../models/column.model';

@Injectable()
export class AdvancedQueryService {
  private pushNavigationChange = new Subject<Array<ListItem>>();
  pushNavigationChange$ = this.pushNavigationChange.asObservable();
  private listChange = new Subject<boolean>();
  listChange$ = this.listChange.asObservable();
  private activeFilterChange = new Subject<ActiveFilter>();
  activeFilterChange$ = this.activeFilterChange.asObservable();

  constructor(private helper: HelperService) {
  }

  listClick(value: boolean) {
    this.listChange.next(value);
  }

  processClick(value: Array<ListItem>) {
    this.pushNavigationChange.next(value);
  }

  pushActiveFilterChange(activeFilter: ActiveFilter) {
    this.activeFilterChange.next(activeFilter);
  }

  getAdvancedQueryNav(): Array<ListItem> {
    const returnResult = new Array<ListItem>();
    Constants.COLUMN_MAP.forEach((item: NavArray) => {
      const dataItem = JSON.parse(localStorage.getItem(item.baseName + 'Array'));
      const helpContent: Array<HelpItem> = JSON.parse(localStorage.getItem(item.baseName + 'Help'));
      const firstLevel = item.baseName + 'Array';
      // Exclude ID fields which have no corresponding stored array
      if (dataItem) {
        returnResult.push(new ListItem({
          column: firstLevel,
          title: firstLevel,
          children: this.filterArray(dataItem, item.columnArray, helpContent, item.indexColumnName),
          checked: true
        }));
      }
    });
    console.log('returnResult', returnResult);
    return returnResult;
  }

  private filterArray(data: Array<Data>, keys: Array<Column>, helpContent: Array<HelpItem>, idField: string): Array<any> {
    switch (keys.length) {
      case 1:
        console.log(data, keys[0], helpContent, idField);
        return this.filterFirst(data, keys[0], helpContent, idField);
      case 2:
        const first2 = this.filterFirst(data, keys[0], helpContent, idField);
        first2.forEach(item => {
          item.children = this.filterSecond(data, keys, helpContent, item.title, idField);
        });
        return first2;
      case 3:
        const first3 = this.filterFirst(data, keys[0], helpContent, idField);
        first3.forEach((item) => {
          item.children = this.filterSecond(data, keys, helpContent, item.title, idField);
        });
        first3.forEach(item => {
          item.children.forEach((second2) => {
            second2.children = this.filterThird(data, keys, helpContent, item.title, second2.title, idField);
          });
        });
        return first3;
    }
  }

  private filterFirst(data: Array<Data>, column: Column, helpContent: Array<HelpItem>, idField: string): any {
    const mapItem = new Map<string, Data>();
    data.forEach(item => {
      try {
        const id = item[idField].match(column.findExpression) ? item[idField].match(column.findExpression)[1] : null;
        mapItem.set(id, item);
      } catch (e) {
        console.error('filterFirst', e, item, data, column, helpContent, idField);
      }
    });
    return this.returnListItem(mapItem, helpContent, column);
  }

  private filterSecond(data: Array<Data>, columns: Array<Column>, helpContent: Array<HelpItem>, firstLevel: string, idField: string): any {
    const mapItem = new Map<string, Data>();
    const filteredResults = data.filter(item => {
      return item[columns[0].columnName] === firstLevel;
    });
    filteredResults.forEach(item => {
      const id = item[idField].match(columns[1].findExpression)[1];
      mapItem.set(id, item);
    });
    return this.returnListItem(mapItem, helpContent, columns[1]);
  }

  private filterThird(data: Array<any>, columns: Array<Column>, helpContent: Array<HelpItem>,
                      firstLevel: string, secondLevel: string, idField: string): any {

    const mapItem = new Map<string, Data>();
    data.forEach(item => {
      if (item[columns[0].columnName] === firstLevel && item[columns[1].columnName] === secondLevel && item[columns[2].columnName]) {
        try {
          const id = item[idField].match(columns[2].findExpression)[1];
          mapItem.set(id, item);
        } catch (e) {
          console.error('filterThird', e, item, data, columns, helpContent, firstLevel, secondLevel, idField);
        }
      }
    });
    return this.returnListItem(mapItem, helpContent, columns[2]);
  }

  private returnListItem(mapItem: Map<string, Data>, helpContent: Array<HelpItem>, column: Column): Array<ListItem> {
    const result = new Array<ListItem>();
    mapItem.forEach((item, key) => {
      if (key) {
        const helpItem = helpContent.find(content => {
          return content.id.toString().trim() === key.toString().trim();
        }) || new HelpItem();
        result.push(new ListItem({
          title: item[column.columnName],
          column: item[column.columnName].replace(/\s/g, '_'),
          children: [],
          checked: true,
          helpText: helpItem.helpText
        }));
      }
    });
    return result;
  }


}
