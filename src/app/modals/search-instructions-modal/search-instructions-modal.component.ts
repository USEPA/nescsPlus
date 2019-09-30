import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-search-instructions-modal',
  templateUrl: './search-instructions-modal.component.html',
  styleUrls: ['./search-instructions-modal.component.scss']
})
export class SearchInstructionsModalComponent implements OnInit {

  constructor(public modalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
