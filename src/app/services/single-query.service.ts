import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {SingleQueryItem} from '../models/single-query-item';
import {DataService} from './data.service';
import {Constants} from '../models/constants';

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
        value.environmental,
        this.getText('environmental', value.environmental),
        value.ecological,
        this.getText('ecological', value.ecological),
        value.directUse,
        this.getText('directUse', value.directUse),
        value.directUser,
        this.getText('directUser', value.directUser)
      ]);
    });

    return {
      data: prepData,
      columns: [{title: 'Name/Label', className: 'blue'}, {title: 'FESCID2244', className: 'blue'},
        {title: 'Environmental ID', className: 'blue'}, {title: 'Environmental Text', className: 'blue'},
        {title: 'Ecological ID', className: 'blue'}, {title: 'Ecological Text', className: 'blue'},
        {title: 'Direct Use ID', className: 'blue'}, {title: 'Direct Use Text', className: 'blue'},
        {title: 'Direct User ID', className: 'blue'}, {title: 'Direct User Text', className: 'blue'}]
    };
  }

  getText(scope, id) {

    const data = JSON.parse(localStorage.getItem(scope + 'Help'));
    const item = data.find((element) => {
      return element.id === id;
    });
    return item.text;
  }

  retrieveFES2244ID(data) {
    const FESArray = [];
    ['environmental', 'ecological', 'directUse', 'directUser'].forEach((item) => {
      FESArray.push(data[item]);
    });
    return FESArray.join('.');
  }

}
