import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {SingleQueryItem} from '../models/single-query-item';

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
      columns: [{title: 'Name/Label', className: 'blue'}, {title: 'NESCS Plus ID (WWW.X.YYYY.ZZZZ)', className: 'blue'},
        {title: 'Environment (WWW)', className: 'greenBackground'}, {title: 'Environment Class', className: 'greenBackground'},
        {title: 'Ecological End-Product (X)', className: 'lightGreenBackground'},
        {title: 'Ecological End-Product Class', className: 'lightGreenBackground'},
        {title: 'Direct Use (YYYY)', className: 'darkBlueBackground'}, {title: 'Direct Use Class', className: 'darkBlueBackground'},
        {title: 'Direct User (ZZZZ)', className: 'lightBlueBackground'}, {title: 'Direct User Class', className: 'lightBlueBackground'}]
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
