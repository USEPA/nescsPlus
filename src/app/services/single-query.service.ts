import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ListItem} from '../models/listItem';
import {SingleQueryItem} from '../models/single-query-item';
import {Constants} from '../models/constants';
import {Column} from '../models/column.model';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SingleQueryService {
  public singleQueryMap = new BehaviorSubject(new Map<string, SingleQueryItem>());
  public singleQueryAction = new BehaviorSubject(String('add'));

  constructor() {
  }

  prepDisplay(): any {
    const results = this.singleQueryMap.getValue();
    const prepData = [];
    results.forEach((value: SingleQueryItem, key: string, map) => {
      prepData.push([
        key,
        this.retrieveFES2244ID(value),
        value.ecological,
        this.getText('ecological', value.ecological),
        value.environmental,
        this.getText('environmental', value.environmental),
        value.directUse,
        this.getText('directUse', value.directUse),
        value.directUser,
        this.getText('directUser', value.directUser)
      ]);
    });

    return {
      data: prepData,
      columns: [{title: 'Name/Label', className: 'blue'}, {title: 'FESCID2244', className: 'blue'},
        {title: 'Ecological ID', className: 'blue'}, {title: 'Ecological Text', className: 'blue'},
        {title: 'Environmental ID', className: 'blue'}, {title: 'Environmental Text', className: 'blue'},
        {title: 'Direct Use ID', className: 'blue'}, {title: 'Direct Use Text', className: 'blue'},
        {title: 'Direct User ID', className: 'blue'}, {title: 'Direct User Text', className: 'blue'}]
    };
  }

  getText(scope, id) {
    function isId(element, index, array) {
      return element.FESID2244 === id;
    }

    const data = JSON.parse(localStorage.getItem(scope + 'Array'));
    const item = data.find(isId);
    const columns = DataService.returnColumnNames( scope + 'Array');
    const values = columns.map(propertyName => {
      return item[propertyName];
    });
    return values.join(' - ');
  }

  retrieveFES2244ID(data) {
    const FESArray = [];
    ['ecological', 'environmental', 'directUse', 'directUser'].forEach((item) => {
      FESArray.push(data[item]);
    });
    return FESArray.join('.');
  }

}
