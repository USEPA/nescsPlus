import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppService} from './services/app.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('searchInfoTemplate', {static: false}) searchInfoTemplate;
  currentNavigation: string;
  appServiceCurrent: Subscription;
  modalRef: BsModalRef;

  constructor(private appService: AppService,
              private router: Router,
              private modalService: BsModalService) {
    this.appServiceCurrent = this.appService.currentNavigation$.subscribe(currentNavigation$ => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.currentNavigation = currentNavigation$;
      });
    });
  }

  ngOnInit(): void {
    this.router.navigateByUrl('advancedQuery');
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
