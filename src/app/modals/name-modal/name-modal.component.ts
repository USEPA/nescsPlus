import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss']
})
export class NameModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
