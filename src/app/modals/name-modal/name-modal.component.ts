import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {SingleQueryService} from '../../services/single-query.service';
import {SingleQueryItem} from '../../models/single-query-item';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss']
})
export class NameModalComponent implements OnInit {
  action: string;
  ecological: string;
  environmental: string;
  directUse: string;
  directUser: string;
  filterName: string;
  originalName: string;
  singleQueryMap: Map<string, SingleQueryItem>;


  constructor(public bsModalRef: BsModalRef, public singleQueryService: SingleQueryService) {
  }

  ngOnInit() {
    console.log('this', this);
  }

  actionItem(): void {
    console.log(this.ecological, this.environmental, this.directUse, this.directUser, this.filterName);

    this.singleQueryMap = this.singleQueryService.singleQueryMap.getValue();
    if (this.action === 'edit') {
      this.singleQueryMap.delete(this.originalName);
    }
    this.singleQueryMap.set(this.filterName, new SingleQueryItem({
      ecological: this.ecological,
      environmental: this.environmental,
      directUse: this.directUse,
      directUser: this.directUser
    }));
    this.singleQueryService.singleQueryMap.next(this.singleQueryMap);
    this.bsModalRef.hide();
  }

}
