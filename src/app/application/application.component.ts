import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {environment} from '../../environments/environment';
import {AppService} from '../services/app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  @ViewChild('searchInfoTemplate', {static: false}) searchInfoTemplate;
  currentNavigation: string;
  appServiceCurrent: Subscription;
  modalRef: BsModalRef;
  // Create a "Last Updated" date for the One EPA Template footer
  lastModifiedDate = new Date(document.lastModified);

  // This checks to see if we're in production and if so will show/hide certain parts of the template (like Google Analytics)
  isProduction = environment.production;

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
    this.router.navigate(['application/multipleQuery']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
