import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppService} from '../services/app.service';
import {Options} from '../models/options';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NameModalComponent} from '../modals/name-modal/name-modal.component';
import {DeleteModalComponent} from '../modals/delete-modal/delete-modal.component';
import {SingleQueryService} from '../services/single-query.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SingleQueryItem} from '../models/single-query-item';
import {Constants} from '../models/constants';
import {Column} from '../models/column.model';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.scss']
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
  singleQuerySubscription: Subscription;
  singleQueryActionSubscription: Subscription;
  singleQueryMap: Map<string, SingleQueryItem>;
  showDataTable: boolean;
  filterName: string;

  constructor(private appService: AppService,
              private modalService: BsModalService,
              private singleQueryService: SingleQueryService) {
    this.singleQuerySubscription = this.singleQueryService.singleQueryMap.subscribe(
      singleQueryMap => {
        this.singleQueryMap = singleQueryMap;
        this.showDataTable = this.singleQueryMap.size !== 0;
      }
    );
    this.singleQueryActionSubscription = this.singleQueryService.singleQueryAction.subscribe(
      buttonAction => {
        this.buttonAction = buttonAction;
        this.enableButton();
      }
    );
  }

  ngOnInit(): void {
    console.log('CustomQueryComponent - ngOnInit');
    this.appService.setNavigation('customQuery');
    this.ecologicalList = this.retrieveOptions('ecological');
    this.environmentalList = this.retrieveOptions('environmental');
    this.directUseList = this.retrieveOptions('directUse');
    this.directUserList = this.retrieveOptions('directUser');
  }

  enableButton(): void {
    if (this.selectedDirectUse && this.selectedDirectUser && this.selectedEcological && this.selectedEnvironmental) {
      this.buttonAction = this.buttonAction.replace('Disable', '');
    } else if (this.buttonAction.indexOf('Disable') === -1) {
      this.buttonAction += 'Disable';
    }
  }

  openNameModal(): void {
    const initialState = {
      environmental: this.selectedEnvironmental,
      ecological: this.selectedEcological,
      directUse: this.selectedDirectUse,
      directUser: this.selectedDirectUser,
      action: this.buttonAction,
      filterName: '',
      originalName: ''
    };
    this.nameModalRef = this.modalService.show(NameModalComponent, {initialState});
  }

  editAction(): void {
    console.log('editAction openNameModal', this);
    const initialState = {
      environmental: this.selectedEnvironmental,
      ecological: this.selectedEcological,
      directUse: this.selectedDirectUse,
      directUser: this.selectedDirectUser,
      action: this.buttonAction,
      filterName: this.filterName,
      originalName: this.filterName
    };
    this.nameModalRef = this.modalService.show(NameModalComponent, {initialState});
  }

  setAction(event): void {
    this.buttonAction = event;
    this.enableButton();
    console.log('setAction', event);
  }

  initializeEdit(map): void {
    console.log('initializeEdit: ', map, map.entries().next().value);
    const value = map.values().next().value;
    this.selectedEnvironmental = value.environmental;
    this.selectedEcological = value.ecological;
    this.selectedDirectUse = value.directUse;
    this.selectedDirectUser = value.directUser;
    this.filterName = map.keys().next().value;
  }

  private retrieveOptions(item: string): Array<Options> {
    const data: any = JSON.parse(localStorage.getItem(item + 'Help'));
    const results = new Map<string, Options>();
    data.forEach(lineItem => {
      results.set(lineItem.id, new Options({
          text: lineItem.text,
          id: lineItem.id
        })
      );
    });
    return Array.from(results.values());
  }

}
