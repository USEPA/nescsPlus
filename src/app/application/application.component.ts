import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {environment} from '../../environments/environment';
import {AppService} from '../services/app.service';
import {Router} from '@angular/router';
import {SearchInstructionsModalComponent} from '../modals/search-instructions-modal/search-instructions-modal.component';
import {Constants} from '../models/constants';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {
  @ViewChild('applicationButtons') applicationButtonsRef: ElementRef;
  @ViewChild('bannerText') bannerTextRef: ElementRef;
  currentNavigation: string;
  appServiceCurrent: Subscription;
  modalRef: BsModalRef;
  CONTACT_US = Constants.CONTACT_US;
  deployPath = environment.deployPath;
  targetRefSubscription: Subscription;

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
    this.targetRefSubscription = this.appService.targetRef.subscribe(targetRef => {
      if (targetRef.length) {
        this[targetRef].nativeElement.scrollIntoView();
      }
    });
  }

  ngOnInit(): void {
    this.router.navigate(['application/multipleQuery']);
  }

  openModal() {
    this.modalRef = this.modalService.show(SearchInstructionsModalComponent, {});
  }

  ngOnDestroy() {
    this.targetRefSubscription.unsubscribe();
    this.appServiceCurrent.unsubscribe();
  }

}
