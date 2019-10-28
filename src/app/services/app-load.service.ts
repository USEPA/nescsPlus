import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Constants} from '../models/constants';
import {Data} from '../models/data.model';
import {Column} from '../models/column.model';


@Injectable()
export class AppLoadService {
  private dataUrl: string = environment.deployPath + 'assets/data.json';  // URL to web api

  constructor(private httpClient: HttpClient) {
  }


  static compareFn(a, b, columnArray: Array<string>): number {
    for (const columnIndex of columnArray) {
      if (a[columnIndex].toUpperCase() < b[columnIndex].toUpperCase()) {
        return -1;
      }
      if (a[columnIndex].toUpperCase() > b[columnIndex].toUpperCase()) {
        return 1;
      }
    }
    return 0;
  }

  static setFullDisplay(data: any): void {
    localStorage.setItem('data', JSON.stringify(data));
  }

  getSettings() {

    this.httpClient.get(this.dataUrl).subscribe((rows: Array<Data>) => {
      AppLoadService.setFullDisplay(rows);
      this.setEnvironmentalArray(rows);
      this.setEcologicalArray(rows);
      this.setDirectUseArray(rows);
      this.setDirectUserArray(rows);
      this.setBeneficiaryArray(rows);
    });

  }

  private getDefinedColumns(data: Array<Data>, displayColumns: Array<Column>, idColumn: Column, index: number): Array<any> {
    const results = new Map<number, Data>();
    data.forEach(item => {
      const row = new Data();
      displayColumns.forEach(column => {
        row[column.columnName] = item[column.columnName];
      });
      if (index !== null) {
        row[idColumn.columnName] = item[idColumn.columnName].split('.')[index];
      } else {
        row[idColumn.columnName] = item[idColumn.columnName];
      }
      results.set(row[idColumn.columnName], row);
    });
    return Array.from(results.values());
  }


  private setEnvironmentalArray(data: Array<Data>) {
    const columns = Constants.ENVIRONMENTAL_COLUMN_ARRAY.columnArray;
    const environmentalArray = this.getDefinedColumns(data, columns, Constants.ID_COLUMN.columnArray[0], 0);
    environmentalArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, ['EnvironmentalClass', 'EnvironmentalSubclass']);
    });
    localStorage.setItem('environmentalArray', JSON.stringify(environmentalArray));
  }

  private setEcologicalArray(data: Array<Data>): void {
    const columns = Constants.ECOLOGICAL_COLUMN_ARRAY.columnArray;
    const ecologicalArray = this.getDefinedColumns(data, columns, Constants.ID_COLUMN.columnArray[0], 1);
    ecologicalArray.sort((a, b) => {
      const sortResult = AppLoadService.compareFn(a, b, ['EcologicalClass']);
      return sortResult;
    });
    localStorage.setItem('ecologicalArray', JSON.stringify(ecologicalArray));
  }


  private setDirectUseArray(data: Array<Data>): void {
    const columns = Constants.DIRECT_USE_COLUMN_ARRAY.columnArray;
    const directUseArray = this.getDefinedColumns(data, columns, Constants.ID_COLUMN.columnArray[0], 2);
    directUseArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, ['DirectUseClass', 'DirectUseSubclassI', 'DirectUseSubclassII']);
    });
    localStorage.setItem('directUseArray', JSON.stringify(directUseArray));
  }

  private setDirectUserArray(data: Array<Data>): void {
    const columns = Constants.DIRECT_USER_COLUMN_ARRAY.columnArray;
    const directUserArray = this.getDefinedColumns(data, columns, Constants.ID_COLUMN.columnArray[0], 3);
    directUserArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, ['DirectUserClass', 'DirectUserSubclassI', 'DirectUserSubclassII']);
    });
    localStorage.setItem('directUserArray', JSON.stringify(directUserArray));
  }


  private setBeneficiaryArray(data: Array<Data>): void {
    const columns = Constants.BENEFICIARY_COLUMN_ARRAY.columnArray;
    const beneficiaryArray = this.getDefinedColumns(data, columns, Constants.BENEFICIARY_ID_COLUMN.columnArray[0], null);
    beneficiaryArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, ['BeneficiaryCategory', 'BeneficiarySubcategory']);
    });
    localStorage.setItem('beneficiaryArray', JSON.stringify(beneficiaryArray));
  }

}
