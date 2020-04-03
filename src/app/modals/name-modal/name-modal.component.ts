import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {SingleQueryService} from '../../services/single-query.service';
import {SingleQueryItem} from '../../models/single-query-item';
import {SingleQueryAction} from '../../models/single-query-action';
import {Action} from '../../models/enums';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss']
})
export class NameModalComponent implements OnInit {
  singleAction: SingleQueryAction;
  ecological: string;
  environmental: string;
  directUse: string;
  directUser: string;
  originalName: string;
  singleQueryMap: Map<string, SingleQueryItem>;


  constructor(public bsModalRef: BsModalRef, public singleQueryService: SingleQueryService) {
  }

  ngOnInit() {
  }

  actionItem(): void {
    this.singleQueryMap = this.singleQueryService.singleQueryMap.getValue();
    if (this.singleAction.action === Action.Edit) {
      this.singleQueryMap.delete(this.originalName);
    }
    this.singleQueryMap.set(this.singleAction.title, new SingleQueryItem({
      environmental: this.environmental,
      ecological: this.ecological,
      directUse: this.directUse,
      directUser: this.directUser
    }));
    this.singleQueryService.singleQueryMap.next(this.singleQueryMap);
    this.singleQueryService.modalHidden.next(true);
    this.bsModalRef.hide();
  }

}
