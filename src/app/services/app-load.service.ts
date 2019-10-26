import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Constants} from '../models/constants';
import {Data} from '../models/data.model';


@Injectable()
export class AppLoadService {
  private dataUrl: string = environment.deployPath + 'assets/data.json';  // URL to web api

  constructor(private httpClient: HttpClient) {
  }


  getSettings() {
    console.log(`getSettings:: before http.get call`);

    this.httpClient.get(this.dataUrl).subscribe((rows: Array<Data>) => {
      this.setFullDisplay(rows);
      this.setEnvironmentalArray(rows);
      this.setEcologicalArray(rows);
      this.setDirectUseArray(rows);
      this.setDirectUserArray(rows);
      this.setBeneficiaryArray(rows);
    });

  }

  private getDefinedColumns(data: Array<Data>, displayColumns: Array<string>): Array<any> {
    console.log('data', data);
    const columns = Constants.FULL_COLUMN_DISPLAY;
    const results = data.map((item) => {
      return columns.map((index) => {
        return item[index];
      });
    });

    return results;
  }

  private setFullDisplay(data: any): void {
    localStorage.setItem('data', JSON.stringify(data));
  }

  private setEnvironmentalArray(data: any) {
    const columns = Constants.ENVIRONMENTAL_COLUMN_ARRAY;
    columns.push('FESID2244');
    console.log('columns setEnvironmentalArray', columns);
    const tempArray = this.getDefinedColumns(data, columns);
    const environmentalArray = [];
    tempArray.forEach((item, index) => {
      if (index) {
        const environmentalId = item[2].split('.')[0];
        const foundItem = environmentalArray.map((x) => {
          return x.id;
        }).indexOf(environmentalId);
        if (foundItem === -1) {
          environmentalArray.push({
            id: environmentalId,
            environmentalClass: item[0].trim(),
            environmentalSubClass: item[1].trim()
          });
        }
      }
    });
    environmentalArray.sort((a, b) => {
      const ecoClassA = a.environmentalClass.toUpperCase();
      const ecoClassB = b.environmentalClass.toUpperCase();
      const ecoSubClassA = a.environmentalSubClass.toUpperCase();
      const ecoSubClassB = b.environmentalSubClass.toUpperCase();
      return this.classSort(ecoClassA, ecoClassB, ecoSubClassA, ecoSubClassB, null, null);
    });
    localStorage.setItem('environmentalArray', JSON.stringify(environmentalArray));
  }

  private setEcologicalArray(data: any): void {
    const columns = Constants.ECOLOGICAL_COLUMN_ARRAY;
    columns.push('FESID2244');
    const tempArray = this.getDefinedColumns(data, columns);
    const ecologicalArray = [];
    tempArray.forEach((item, index) => {
      if (index) {
        const ecologicalId = item[1].split('.')[1];
        const foundItem = ecologicalArray.map((x) => {
          return x.id;
        }).indexOf(ecologicalId);
        if (foundItem === -1) {
          ecologicalArray.push({
            id: ecologicalId,
            ecologicalClass: item[0].trim()
          });
        }
      }
    });
    ecologicalArray.sort((a, b) => {
      const ecoClassA = a.ecologicalClass.toUpperCase();
      const ecoClassB = b.ecologicalClass.toUpperCase();

      return this.classSort(ecoClassA, ecoClassB, null, null, null, null);
    });
    localStorage.setItem('ecologicalArray', JSON.stringify(ecologicalArray));
  }


  private setDirectUseArray(data: any): void {
    const columns = Constants.DIRECT_USE_COLUMN_ARRAY;
    columns.push('FESID2244');
    const tempArray = this.getDefinedColumns(data, columns);
    const directUseArray = [];
    tempArray.forEach((item, index) => {
      if (index) {
        const directUseId = item[3].split('.')[2];
        const foundItem = directUseArray.map((x) => {
          return x.id;
        }).indexOf(directUseId);
        if (foundItem === -1) {
          directUseArray.push({
            id: directUseId,
            directUseClass: item[0],
            directUseSubClassI: item[1].trim(),
            directUseSubClassII: item[2].trim()
          });
        }
      }
    });
    directUseArray.sort((a, b) => {
      const ecoClassB = b.directUseClass.toUpperCase();
      const ecoSubIClassA = a.directUseSubClassI.toUpperCase();
      const ecoSubIClassB = b.directUseSubClassI.toUpperCase();
      const ecoSubIIClassA = a.directUseSubClassII.toUpperCase();
      const ecoSubIIClassB = b.directUseSubClassII.toUpperCase();

      return this.classSort(a.directUseClass.toUpperCase(), ecoClassB, ecoSubIClassA, ecoSubIClassB, ecoSubIIClassA, ecoSubIIClassB);
    });
    localStorage.setItem('directUseArray', JSON.stringify(directUseArray));
  }

  private setDirectUserArray(data: any): void {
    const columns = Constants.DIRECT_USER_COLUMN_ARRAY;
    columns.push('FESID2244');
    const tempArray = this.getDefinedColumns(data, columns);
    const directUserArray = [];
    tempArray.forEach((item, index) => {
      if (index) {
        const directUserId = item[3].split('.')[3];
        const foundItem = directUserArray.map((x) => {
          return x.id;
        }).indexOf(directUserId);
        if (foundItem === -1) {
          directUserArray.push({
            id: directUserId,
            directUserClass: item[0].trim(),
            directUserSubClassI: item[1].trim(),
            directUserSubClassII: item[2].trim()
          });
        }
      }
    });
    directUserArray.sort((a, b) => {
      const ecoClassA = a.directUserClass.toUpperCase();
      const ecoClassB = b.directUserClass.toUpperCase();
      const ecoSubIClassA = a.directUserSubClassI.toUpperCase();
      const ecoSubIClassB = b.directUserSubClassI.toUpperCase();
      const ecoSubIIClassA = a.directUserSubClassII.toUpperCase();
      const ecoSubIIClassB = b.directUserSubClassII.toUpperCase();

      return this.classSort(ecoClassA, ecoClassB, ecoSubIClassA, ecoSubIClassB, ecoSubIIClassA, ecoSubIIClassB);
    });
    localStorage.setItem('directUserArray', JSON.stringify(directUserArray));
  }


  private setBeneficiaryArray(data: any): void {
    const columns = Constants.BENEFICIARY_COLUMN_ARRAY;
    columns.push('FEGSIDNumber');
    const tempArray = this.getDefinedColumns(data, columns);
    const beneficiaryArray = [];
    tempArray.forEach((item, index) => {
      if (index) {
        const beneficiaryId = item[2];
        const foundItem = beneficiaryArray.map((x) => {
          return x.id;
        }).indexOf(beneficiaryId);
        if (foundItem === -1) {
          beneficiaryArray.push({
            id: beneficiaryId,
            beneficiaryClass: item[0].trim(),
            beneficiarySubClass: item[1].trim()
          });
        }
      }
    });
    beneficiaryArray.sort((a, b) => {
      const ecoClassA = a.beneficiaryClass.toUpperCase();
      const ecoClassB = b.beneficiaryClass.toUpperCase();
      const ecoSubClassA = a.beneficiarySubClass.toUpperCase();
      const ecoSubClassB = b.beneficiarySubClass.toUpperCase();
      return this.classSort(ecoClassA, ecoClassB, ecoSubClassA, ecoSubClassB, null, null);
    });
    localStorage.setItem('beneficiaryArray', JSON.stringify(beneficiaryArray));
  }


  classSort(ecoClassA, ecoClassB, ecoSubIClassA, ecoSubIClassB, ecoSubIIClassA, ecoSubIIClassB) {
    if (ecoClassA < ecoClassB) {
      return -1;
    }
    if (ecoClassA > ecoClassB) {
      return 1;
    }
    if (ecoSubIClassA) {
      if (ecoSubIClassA < ecoSubIClassB) {
        return -1;
      }
      if (ecoSubIClassA > ecoSubIClassB) {
        return 1;
      }
    }
    if (ecoSubIIClassA) {
      if (ecoSubIIClassA < ecoSubIIClassB) {
        return -1;
      }
      if (ecoSubIIClassA > ecoSubIIClassB) {
        return 1;
      }
    }

    // names must be equal
    return 0;
  }
}
