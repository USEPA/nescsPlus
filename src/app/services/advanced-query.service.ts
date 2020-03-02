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

  /**
   * If no results are returned check the regEx in the findExpression property
   */
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
          checked: false
        }));
      }
    });
    return returnResult;
  }

  private filterArray(data: Array<Data>, keys: Array<Column>, helpContent: Array<HelpItem>, idField: string): Array<any> {
    switch (keys.length) {
      case 1:
        return this.filterFirst(data, keys[0], helpContent, idField);
      case 2:
        const first2 = this.filterFirst(data, keys[0], helpContent, idField);
        first2.forEach(item => {
          item.children = this.filterSecond(data, keys, helpContent, item, idField);
        });
        return first2;
      case 3:
        const first3 = this.filterFirst(data, keys[0], helpContent, idField);
        first3.forEach(item => {
          item.children = this.filterSecond(data, keys, helpContent, item, idField);
          if (item.children.length === 1) {
            item.children[0].visible = false;
          }
        });
        first3.forEach(item => {
          item.children.forEach(second2 => {
            second2.children = this.filterThird(data, keys, helpContent, second2, idField);
            if (second2.children.length === 1) {
              second2.children[0].visible = false;
            }
          });
        });
        return first3;
    }
  }

  private filterFirst(data: Array<Data>, column: Column, helpContent: Array<HelpItem>, idField: string): Array<ListItem> {
    const mapItem = new Map<string, Data>();
    data.forEach(item => {
      try {
        const id = item[idField].match(column.findExpression) ? item[idField].match(column.findExpression)[1] : null;
        mapItem.set(id, item);
      } catch (e) {
        console.error('error occurred - arguments for filterFirst', e, item, data, column, helpContent, idField);
      }
    });
    return this.returnListItem(mapItem, helpContent, column, false);
  }

  private filterSecond(data: Array<Data>, columns: Array<Column>, helpContent: Array<HelpItem>,
                       firstLevel: ListItem, idField: string): Array<ListItem> {
    const mapItem = new Map<string, Data>();
    const filteredResults = data.filter(item => {
      return item[idField].match(firstLevel.findExpression)[1] === firstLevel.id;
    });
    filteredResults.forEach(item => {
      const id = item[idField].match(columns[1].findExpression)[1];
      mapItem.set(id, item);
    });
    return this.returnListItem(mapItem, helpContent, columns[1], false);
  }

  private filterThird(data: Array<any>, columns: Array<Column>, helpContent: Array<HelpItem>,
                      secondLevel: ListItem, idField: string): Array<ListItem> {

    const mapItem = new Map<string, Data>();
    data.forEach(item => {
      if (item[idField].match(secondLevel.findExpression)[1] === secondLevel.id && item[columns[2].columnName]) {
        try {
          const id = item[idField].match(columns[2].findExpression)[1];
          mapItem.set(id, item);
        } catch (e) {
          console.error('filterThird', e, item, data, columns, helpContent, secondLevel, idField);
        }
      }
    });
    return this.returnListItem(mapItem, helpContent, columns[2], false);
  }

  private returnListItem(mapItem: Map<string, Data>, helpContent: Array<HelpItem>, column: Column, disabled: boolean): Array<ListItem> {
    const result = new Array<ListItem>();
    mapItem.forEach((item, key) => {
      try {
        if (key) {
          const helpItem = helpContent.find(content => {
            return content.id.toString().trim() === key.toString().trim();
          }) || new HelpItem();
          result.push(new ListItem({
            title: item[column.columnName],
            column: item[column.columnName].replace(/\s/g, '_'),
            children: [],
            checked: false,
            disable: disabled,
            helpText: helpItem.helpText,
            id: key,
            findExpression: column.findExpression
          }));
        }
      } catch (e) {
        console.error('error:', e, ' mapItem:', mapItem, ' helpContent:', helpContent, ' column:', column);
      }
    });
    return result;
  }


}
