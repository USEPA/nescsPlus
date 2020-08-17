import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  helpText: string;
  title: string;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
