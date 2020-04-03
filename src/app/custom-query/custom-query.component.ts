import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../services/app.service';
import {Options} from '../models/options';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NameModalComponent} from '../modals/name-modal/name-modal.component';
import {SingleQueryService} from '../services/single-query.service';
import {SingleQueryItem} from '../models/single-query-item';
import {Subscription} from 'rxjs';
import {SingleQueryAction} from '../models/single-query-action';
import {Action} from '../models/enums';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.scss']
})
export class CustomQueryComponent implements OnInit, OnDestroy {
  @ViewChild('nameTemplate', {static: false}) nameTemplate;
  ecologicalList: Array<Options>;
  environmentalList: Array<Options>;
  directUseList: Array<Options>;
  directUserList: Array<Options>;
  selectedEcological: any;
  selectedEnvironmental: any;
  selectedDirectUse: any;
  selectedDirectUser: any;
  buttonAction: SingleQueryAction;
  enableButton: boolean;
  singleQuerySubscription: Subscription;
  singleQueryActionSubscription: Subscription;
  modalHiddenSubscription: Subscription;
  singleQueryMap: Map<string, SingleQueryItem>;
  showDataTable: boolean;
  filterName: string;
  Action = Action;

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
        this.toggleButton();
      }
    );
    this.modalHiddenSubscription = this.singleQueryService.modalHidden.subscribe(
      isHidden => {
        this.buttonAction = new SingleQueryAction();
        this.buttonAction.action = Action.Add;
        this.buttonAction.title = '';
      }
    );
  }

  ngOnInit(): void {
    this.appService.setNavigation('customQuery');
    this.ecologicalList = this.retrieveOptions('ecological');
    this.environmentalList = this.retrieveOptions('environmental');
    this.directUseList = this.retrieveOptions('directUse');
    this.directUserList = this.retrieveOptions('directUser');
  }

  ngOnDestroy(): void {
    this.singleQueryActionSubscription.unsubscribe();
    this.singleQuerySubscription.unsubscribe();
    this.modalHiddenSubscription.unsubscribe();
  }

  toggleButton(): void {
    this.enableButton = false;
    if (this.selectedDirectUse && this.selectedDirectUser && this.selectedEcological && this.selectedEnvironmental) {
      this.enableButton = true;
    }
  }

  openNameModal(): void {
    this.buttonAction.title = '';
    const initialState = {
      animated: true,
      environmental: this.selectedEnvironmental,
      ecological: this.selectedEcological,
      directUse: this.selectedDirectUse,
      directUser: this.selectedDirectUser,
      singleAction: this.buttonAction,
      originalName: ''
    };
    const nameModalRef = this.modalService.show(NameModalComponent, {initialState});
  }

  editAction(): void {
    const initialState = {
      environmental: this.selectedEnvironmental,
      ecological: this.selectedEcological,
      directUse: this.selectedDirectUse,
      directUser: this.selectedDirectUser,
      singleAction: this.buttonAction,
      originalName: this.filterName
    };
    const nameModalRef: BsModalRef = this.modalService.show(NameModalComponent, {initialState});
  }

  setAction(event): void {
    this.buttonAction = event;
    this.toggleButton();
  }

  initializeEdit(map): void {
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
