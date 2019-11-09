import {Component, Input, OnInit} from '@angular/core';
import {ListItem} from '../models/listItem';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NameModalComponent} from '../modals/name-modal/name-modal.component';
import {HelpComponent} from '../modals/help/help.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']

})

export class ListComponent implements OnInit {
  @Input() data: Array<ListItem>;
  @Input() level;
  @Input() serviceName: string;
  @Input() disableChildren: boolean;
  modalRef: BsModalRef;
  service: any;

  constructor(private advancedQueryService: AdvancedQueryService, private toggleColumnsService: ToggleColumnsService,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    // Set service to send information
    if (this.serviceName === 'advancedQuery') {
      this.service = this.advancedQueryService;
    } else {
      this.service = this.toggleColumnsService;
    }
  }

  sendChange(item: ListItem): void {
    item.checked = !item.checked;
    // Toggle Children
    if (item.children && item.children.length) {
      if (!this.disableChildren) {
        this.toggleChecks(item.children, item.checked);
      } else {
        if (item.children) {
          this.enableDisableChildren(item.children, item.checked);
        }
      }
    }
    this.service.listClick(true);
  }

  toggleChecks(items: Array<ListItem>, checked: boolean): void {
    items.forEach((item: ListItem) => {
      item.checked = checked;
      if (item.children && item.children.length) {
        this.toggleChecks(item.children, checked);
        // } else if (!item.children) {
        //   item.children = [];
      }
    });
  }

  enableDisableChildren(items: Array<ListItem>, enable: boolean): void {
    items.forEach((item: ListItem) => {

    });
  }

  openModal(argumentText: string) {
    const initialState = {
      helpText: argumentText
    };
    this.modalRef = this.modalService.show(HelpComponent, {initialState});

  }
}
