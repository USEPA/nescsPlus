import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Input() parentItem: ListItem;
  @Output() checked = new EventEmitter<boolean>();
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
    if (!item.disable) {
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
      this.checked.emit(item.checked);
      if (item.checked) {
        if (this.parentItem) {
          this.parentItem.checked = item.checked;
        }
      }
    }
  }

  onChildChecked(checked: boolean, item: ListItem) {
    if (checked) {
      this.checked.emit(checked);
      if (this.parentItem) {
        this.parentItem.checked = checked;
      }
    }
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
      item.disable = enable ? false : true;
      item.checked = enable;
      if (item.children) {
        this.enableDisableChildren(item.children, enable);
      }
    });
  }

  openModal(item: ListItem) {
    const initialState = {
      helpText: item.helpText,
      title: item.title
    };
    this.modalRef = this.modalService.show(HelpComponent, {initialState});
  }

  display(item: ListItem): string {
    let result = item.title;
    if (item.id) {
      result = item.id + ' - ' + item.title;
    }
    return result;
  }
}
