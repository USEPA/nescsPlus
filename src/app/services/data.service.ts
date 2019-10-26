import {Injectable} from '@angular/core';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';
import {DataTableData} from '../models/data-table-data.model';
import {Column} from '../models/column.model';
import {HelperService} from './helper.service';
import {Data} from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  static extractProp(values: Set<ListItem>, propName: string): Set<string> {
    const results = new Set<string>();
    values.forEach((item) => {
      if (!item.checked) {
        results.add(item[propName]);
      }

      if (item.children && item.children.length) {
        const tempList = DataService.extractProp(new Set(item.children), propName);
        if (tempList) {
          tempList.forEach(results.add, results);
        }
      }
    });
    return results;
  }

  static getData(): DataTableData {
    const rawData: Array<Data> = JSON.parse(localStorage.getItem('data'));
    const options = new DataTableData();
    options.data = rawData;

    options.columns = Constants.COLUMN_MAP;
    return options;
  }

  static filterTable(dataTableData: DataTableData, navigationItems: Array<ListItem>): DataTableData {
    Constants.COLUMN_MAP.forEach((column: Column) => {
      let elementList = new Array<string>();
      if (column.arrayName) {
        console.log('column',column);
        // build a regex filter string with an or(|) condition
        elementList = this.getSearchList(navigationItems[column.arrayIndex].children, elementList, column.level, 0);

        const elementValues: string = elementList.map((element) => {
          return element.split(' ').join('/s');
        }).sort().join('|');
        dataTableData.data = dataTableData.data.filter(item => {
          console.log('item, column', item[column.columnName], item[column.columnName].match(elementValues), elementValues);
          return item[column.columnName].match(elementValues) && item[column.columnName].match(elementValues).length;
        });
      }
      console.log('dataTableData.data', dataTableData.data);

    });
    return dataTableData;
  }

  static getSearchList(items: Array<ListItem>, resultArray: Array<string>, index: number, level: number): string[] {
    items.forEach((item) => {
      if (index === level) {
        if (item.checked) {
          resultArray.push(item.title);
        }
      } else if (item.children.length) {
        resultArray = this.getSearchList(item.children, resultArray, index, level + 1);
      }
    });
    return resultArray;
  }

  static hideColumns(selectedRemovedColumns: Set<ListItem>, dataTableData: DataTableData): DataTableData {
    let results = DataService.extractProp(selectedRemovedColumns, 'title');
    results = HelperService.union(results, new Set(Constants.ANCILIARY_COLUMN_ARRAY));
    // let hideItems = [...results].map((item) => {
    //   const foundItem = dataTableData.columns.findIndex(x => x.columnTitle === item);
    //   if (typeof foundItem !== 'undefined' && foundItem !== -1) {
    //     this.toggleHideColumns = this.toggleHideColumns.filter(x => x !== foundItem);
    //     return foundItem;
    //   }
    // });
    // hideItems = hideItems.filter(item => typeof item !== 'undefined');
    // if (hideItems) {
    //   hideItems.forEach((item) => {
    //     dataTableAPI.column(item).visible(false);
    //   });
    // }
    // this.toggleHideColumns.forEach((item) => {
    //   dataTableAPI.column(item).visible(true);
    // });
    // this.toggleHideColumns = hideItems;

    return dataTableData;
  }

  static removeColumns(selectedRemovedColumns: Set<ListItem>, dataTableData: DataTableData): DataTableData {
    dataTableData.columns = dataTableData.columns.filter((column) => {
      return Array.from(selectedRemovedColumns).find((item) => {
        return item.title === column.columnTitle;
      });
    });

    return dataTableData;
  }

  static returnArray(dataTableData: DataTableData): any[] {
    const results = [];
    dataTableData.data.forEach((rowData) => {
      const row = [];
      dataTableData.columns.forEach((columnItem: Column) => {
        row.push(rowData[columnItem.columnName]);
      });
      results.push(row);
    });
    console.log(results, dataTableData);
    return [['2', '2', '2']];
  }

  static returnColumnArray(columns: Array<Column>) {
    return columns.map(item => {
      return item.columnTitle;
    }).concat(Constants.ANCILIARY_COLUMN_ARRAY);
  }
}
