import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppService} from '../services/app.service';
import {Options} from '../models/options';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NameModalComponent} from '../modals/name-modal/name-modal.component';
import {DeleteModalComponent} from '../modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {
  @ViewChild('nameTemplate', {static: false}) nameTemplate;
  ecologicalList: Array<Options>;
  environmentalList: Array<Options>;
  directUseList: Array<Options>;
  directUserList: Array<Options>;
  selectedEcological: any;
  selectedEnvironmental: any;
  selectedDirectUse: any;
  selectedDirectUser: any;
  buttonAction = 'addDisable';
  nameModalRef: BsModalRef;

  constructor(private appService: AppService,
              private modalService: BsModalService) {

  }

  ngOnInit(): void {
    console.log('CustomQueryComponent - ngOnInit');
    this.appService.setNavigation('customQuery');
    this.ecologicalList = this.retrieveOptions('ecologicalArray');
    this.environmentalList = this.retrieveOptions('environmentalArray');
    this.directUseList = this.retrieveOptions('directUseArray');
    this.directUserList = this.retrieveOptions('directUserArray');
  }

  enableAdd(): void {
    if (this.selectedDirectUse && this.selectedDirectUser && this.selectedEcological && this.selectedEnvironmental) {
      this.buttonAction = this.buttonAction.replace('Disable', '');

    } else if (this.buttonAction.indexOf('Disable') === -1) {
      this.buttonAction += 'Disable';
    }
  }

  openNameModal(): void {
    console.log('openNameModal');
    this.nameModalRef = this.modalService.show(NameModalComponent, {});
  }

  editAction(): void {
    console.log('editAction openNameModal');
    this.nameModalRef = this.modalService.show(DeleteModalComponent, {});
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
