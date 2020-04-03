import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SingleQueryService} from '../../services/single-query.service';
import {BsModalRef} from 'ngx-bootstrap';
import {SingleQueryAction} from '../../models/single-query-action';
import {Action} from '../../models/enums';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  @Output() deleteComplete = new EventEmitter();
  key: string

  constructor(public bsModalRef: BsModalRef, private singleQueryService: SingleQueryService) { }

  ngOnInit() {
  }

  deleteItem() {
    const existingMap = this.singleQueryService.singleQueryMap.getValue();
    existingMap.delete(this.key);
    this.singleQueryService.singleQueryMap.next(existingMap);
    const singleAction = new SingleQueryAction();
    singleAction.action = Action.Add;
    this.singleQueryService.singleQueryAction.next(singleAction);
    this.bsModalRef.hide();
  }

}
