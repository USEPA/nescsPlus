import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Constants} from '../models/constants';
import {Data} from '../models/data.model';
import {NavArray} from '../models/nav-array.model';


@Injectable()
export class AppLoadService {
  private today = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate();
  private baseHelpUrl: string = environment.deployPath + 'assets/help/';
  private dataUrl: string = environment.deployPath + 'assets/data.json?v=' + this.today; // URL to web api
  private styleXMLUrl: string = environment.deployPath + 'assets/excelStyles.xml?v=' + this.today;  // URL to web api

  constructor(private httpClient: HttpClient) {
  }


  static compareFn(a, b, columnArray: Array<string>): number {
    try {
      for (const columnIndex of columnArray) {
        if (a[columnIndex].toUpperCase() < b[columnIndex].toUpperCase()) {
          return -1;
        }
        if (a[columnIndex].toUpperCase() > b[columnIndex].toUpperCase()) {
          return 1;
        }
      }
      return 0;
    } catch (e) {
      console.error('unexpected issue AppLoadService.compareFn', e, arguments);
    }
  }

  static setFullDisplay(data: any): void {
    localStorage.setItem('data', JSON.stringify(data));
  }

  getSettings() {
    // Load Export Style for Advance/Multiple Query
    this.httpClient.get(this.styleXMLUrl, {responseType: 'text'}).subscribe((xmlStyle: string) => {
      localStorage.setItem('xmlStyle', xmlStyle);
    });

    // Load Help Files
    Constants.COLUMN_MAP.forEach((item: NavArray) => {
      this.httpClient.get(this.baseHelpUrl + item.baseName + '.json?v=' + this.today).subscribe(response => {
        if (response) {
          localStorage.setItem(item.baseName + 'Help', JSON.stringify(response));
        }
      });
    });

    // Load data
    this.httpClient.get(this.dataUrl).subscribe((rows: Array<Data>) => {
      AppLoadService.setFullDisplay(rows);
      this.setEnvironmentalArray(rows);
      this.setEcologicalArray(rows);
      this.setDirectUseArray(rows);
      this.setDirectUserArray(rows);
      this.setBeneficiaryArray(rows);
    });

  }

  private getDefinedColumns(data: Array<Data>, navArray: NavArray): Array<any> {
    const results = new Map<number, Data>();

    data.forEach(item => {
      const row = new Data();
      navArray.columnArray.forEach(column => {
        row[column.columnName] = item[column.columnName];
      });
      row[navArray.indexColumnName] = item[navArray.indexColumnName];
      results.set(row[navArray.indexColumnName], row);
    });
    return Array.from(results.values());
  }


  private setEnvironmentalArray(data: Array<Data>) {
    const navArray = Constants.ENVIRONMENTAL_COLUMN_ARRAY;
    const environmentalArray = this.getDefinedColumns(data, navArray);
    const columnArray = navArray.columnArray.map(column => {
      return column.columnName;
    });
    environmentalArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, columnArray);
    });
    localStorage.setItem('environmentalArray', JSON.stringify(environmentalArray));
  }

  private setEcologicalArray(data: Array<Data>): void {
    const navArray = Constants.ECOLOGICAL_COLUMN_ARRAY;
    const ecologicalArray = this.getDefinedColumns(data, navArray);
    const columnArray = navArray.columnArray.map(column => {
      return column.columnName;
    });
    ecologicalArray.sort((a, b) => {
      const sortResult = AppLoadService.compareFn(a, b, columnArray);
      return sortResult;
    });
    localStorage.setItem('ecologicalArray', JSON.stringify(ecologicalArray));
  }


  private setDirectUseArray(data: Array<Data>): void {
    const navArray = Constants.DIRECTUSE_COLUMN_ARRAY;
    const directUseArray = this.getDefinedColumns(data, navArray);
    const columnArray = navArray.columnArray.map(column => {
      return column.columnName;
    });
    directUseArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, columnArray);
    });
    localStorage.setItem('directUseArray', JSON.stringify(directUseArray));
  }

  private setDirectUserArray(data: Array<Data>): void {
    const navArray = Constants.DIRECTUSER_COLUMN_ARRAY;
    const directUserArray = this.getDefinedColumns(data, navArray);
    const columnArray = navArray.columnArray.map(column => {
      return column.columnName;
    });
    directUserArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, columnArray);
    });
    localStorage.setItem('directUserArray', JSON.stringify(directUserArray));
  }


  private setBeneficiaryArray(data: Array<Data>): void {
    const navArray = Constants.BENEFICIARY_COLUMN_ARRAY;
    const beneficiaryArray = this.getDefinedColumns(data, navArray);
    const columnArray = navArray.columnArray.map(column => {
      return column.columnName;
    });
    beneficiaryArray.sort((a, b) => {
      return AppLoadService.compareFn(a, b, columnArray);
    });
    localStorage.setItem('beneficiaryArray', JSON.stringify(beneficiaryArray));
  }

}
