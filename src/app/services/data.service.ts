import {Injectable} from '@angular/core';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';
import {DataTableData} from '../models/data-table-data.model';
import {Column} from '../models/column.model';
import {Data} from '../models/data.model';
import {NavArray} from '../models/nav-array.model';
import {ActiveFilter} from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  static getTableData(navigationItems: Array<ListItem>, activeFilter: ActiveFilter, selectedColumns: Set<ListItem>): DataTableData {
    let displayOptions = this.getExportData(navigationItems, activeFilter);
    displayOptions = this.filterTable(displayOptions, navigationItems, activeFilter);
    displayOptions = this.deDuped(displayOptions, selectedColumns);
    return displayOptions;
  }

  static getExportData(navigationItems: Array<ListItem>, activeFilter: ActiveFilter): DataTableData {
    let displayOptions = this.getData();
    displayOptions = this.filterTable(displayOptions, navigationItems, activeFilter);
    return displayOptions;
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

    options.columns = this.concatColumns(Constants.COLUMN_MAP);
    return options;
  }

  static concatColumns(navArray: Array<NavArray>) {
    let results = new Array<Column>();
    navArray.forEach(item => {
      results = results.concat(item.columnArray);
    });
    return results;
  }

  static filterTable(dataTableData: DataTableData, navigationItems: Array<ListItem>, activeFilter: ActiveFilter): DataTableData {
    Constants.COLUMN_MAP.forEach((navArray: NavArray) => {
      if (this.checkActiveFilter(navArray, activeFilter)) {

        navArray.columnArray.forEach((column: Column) => {
          // build a regex filter string with an or(|) condition
          const elementList = this.getSearchList(navigationItems[column.arrayIndex].children, new Array<string>(), column.level, 0);

          const elementValues: string = elementList.map((element) => {
            return element.split(' ').join('\\s');
          }).sort().join('|');

          dataTableData.data = dataTableData.data.filter(item => {
            return item[column.columnName].match(elementValues) && item[column.columnName].match(elementValues).length;
          });
        });
      }

    });
    return dataTableData;
  }

  static checkActiveFilter(navArray: NavArray, activeFilter: ActiveFilter): boolean {
    const excludeIdFields = navArray.arrayName !== 'beneficiaryIdArray' && navArray.arrayName !== 'idArray';

    // When ActiveFilter is Direct exclude Beneficiary Columns
    const checkDirect = activeFilter === ActiveFilter.Direct && !(navArray.arrayName === 'beneficiaryArray');

    // When ActiveFilter is Beneficiary exclude Direct Use and Direct User Columns
    const checkBeneficiary = activeFilter === ActiveFilter.Beneficiary &&
      !(navArray.arrayName === 'directUseArray' || navArray.arrayName === 'directUserArray');

    return excludeIdFields && (checkDirect || checkBeneficiary);
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

  static returnFlatListItemArray(selectedColumns: Array<ListItem>): Array<ListItem> {
    let results = new Array<ListItem>();
    selectedColumns.forEach(item => {
      const tempItem = new ListItem(item);
      let tempChildren = item.children ? Array.from(item.children) : null;
      tempItem.children = null;
      results.push(tempItem);
      if (tempChildren) {
        tempChildren = this.returnFlatListItemArray(Array.from(item.children));
        results = results.concat(tempChildren);
      }
    });
    return results;
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
    return results;
  }

  static returnDataColumnArray(columns: Array<Column>, selectedColumns: Set<ListItem>) {
    const flatColumns = this.returnFlatListItemArray(Array.from(selectedColumns));
    return columns.map(item => {
      const column = flatColumns.find(columnItem => {
        return columnItem.column === item.columnName;
      });
      return {title: item.columnTitle, class: 'blue', visible: column.checked};
    });
  }

  static returnColumnNames(arrayName: string) {
    return Constants.COLUMN_MAP.find(nav => {
      return nav.arrayName === arrayName;
    }).columnArray.map((column: Column) => {
      return column.columnName;
    });
  }

  static deDuped(displayOptions, selectedColumns: Set<ListItem>): DataTableData {
    const columns = this.returnFlatListItemArray(Array.from(selectedColumns));
    const results = new DataTableData();
    results.columns = displayOptions.columns;
    const data = new Map<string, Data>();
    displayOptions.data.forEach((row: Data) => {
      let key = '';
      columns.forEach((item: ListItem) => {
        if (item.checked) {
          key += row[item.column];
        }
      });
      data.set(key, row);
    });
    results.data = Array.from(data.values());
    return results;
  }
}
