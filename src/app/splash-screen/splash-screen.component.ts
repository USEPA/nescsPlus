import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {SplashEntryModalComponent} from '../modals/splash-entry-modal/splash-entry-modal.component';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  modalRef: BsModalRef;

  constructor(private router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.modalRef = this.modalService.show(SplashEntryModalComponent, {class: 'modal-lg'});
  }

  closeButton() {
    localStorage.setItem('initialEntry', 'false');
    this.router.navigate(['application']);
  }
}
