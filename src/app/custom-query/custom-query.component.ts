import {Component, OnInit} from '@angular/core';
import {AppService} from '../services/app.service';
import {Options} from '../models/options';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {
  ecologicalList: Array<Options>;
  environmentalList: Array<Options>;
  directUseList: Array<Options>;
  directUserList: Array<Options>;
  selectedEcological: any;
  selectedEnvironmental: any;
  selectedDirectUse: any;
  selectedDirectUser: any;
  buttonAction = 'addDisable';

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    console.log('CustomQueryComponent - ngOnInit');
    this.appService.setNavigation('customQuery');
    this.ecologicalList = this.retrieveOptions('ecologicalArray');
    this.environmentalList = this.retrieveOptions('environmentalArray');
    this.directUseList = this.retrieveOptions('directUseArray');
    this.directUserList = this.retrieveOptions('directUserArray');
  }

  private retrieveOptions(item: string): Array<Options> {
    const data: any = JSON.parse(localStorage.getItem(item));

    let keys: Array<string> = Object.keys(data[0]);
    keys = keys.splice(1, keys.length);

    const options = data.map((items) => {
      const values = keys.map((propertyName: string) => {
        return items[propertyName];
      });
      return new Options({
        text: values.join(' - '),
        id: items.id
      });
    });
    return options;
  }

}
