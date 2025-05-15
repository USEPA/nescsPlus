import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-search-instructions-how-who-modal',
    templateUrl: './search-instructions-how-who-modal.component.html',
    styleUrls: ['./search-instructions-how-who-modal.component.scss'],
    standalone: false
})
export class SearchInstructionsHowWhoModalComponent implements OnInit {

  constructor(public modalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
