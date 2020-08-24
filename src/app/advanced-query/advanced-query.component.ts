import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AppService} from '../services/app.service';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {ListItem} from '../models/listItem';
import {Subscription} from 'rxjs';
import {ActiveFilter} from '../models/enums';
import {SearchInstructionsHowWhoModalComponent} from '../modals/search-instructions-how-who-modal/search-instructions-how-who-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HelpItem} from '../models/help-item';
import {HelpComponent} from '../modals/help/help.component';
import {SplashEntryModalComponent} from '../modals/splash-entry-modal/splash-entry-modal.component';
import {TutorialService} from '../services/tutorial.service';


@Component({
  selector: 'app-advanced-query',
  templateUrl: './advanced-query.component.html',
  styleUrls: ['./advanced-query.component.scss'],
  providers: [AdvancedQueryService]
})

export class AdvancedQueryComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('reportContentRef') reportContentRef: ElementRef;
  ActiveFilter = ActiveFilter;
  activeFilter: ActiveFilter = null;
  showReport = false;
  navItems: Array<ListItem>;
  level = 0;
  listChanges: Subscription;
  disableChildren = false;
  environmentalNav: Array<ListItem>;
  ecologicalNav: Array<ListItem>;
  directUseNav: Array<ListItem>;
  directUserNav: Array<ListItem>;
  beneficiaryNav: Array<ListItem>;
  modalRef: BsModalRef;
  tutorialClassSubscription: Subscription;

  constructor(private renderer: Renderer2, private appService: AppService, private advancedQueryService: AdvancedQueryService,
              private modalService: BsModalService, private tutorialService: TutorialService) {


    this.listChanges = this.advancedQueryService.listChange$.subscribe(resultActive => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.advancedQueryService.processClick(this.navItems);
      });
    });

    this.tutorialClassSubscription = this.tutorialService.tutorialClass.subscribe(
      classNames => {
        if (this.modalRef) {
          this.modalRef.setClass(classNames);
        }
      }
    );


  }


  ngOnInit() {
    this.appService.setNavigation('advancedQuery');
    this.navItems = this.advancedQueryService.getAdvancedQueryNav();
    this.environmentalNav = [this.navItems[0]];
    this.ecologicalNav = [this.navItems[1]];
    this.directUseNav = [this.navItems[2]];
    this.directUserNav = [this.navItems[3]];
    this.beneficiaryNav = [this.navItems[4]];
  }

  ngAfterViewInit(): void {
    if (this.tutorialService.tutorialAction.getValue()) {
      this.modalRef = this.modalService.show(SplashEntryModalComponent, {class: 'splashContainer'});
    }

  }

  ngOnDestroy(): void {
    this.listChanges.unsubscribe();
    this.tutorialClassSubscription.unsubscribe();
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  generateReport() {
    // Hide Query Button
    this.showReport = true;
  }

  activeFilterChange(value: ActiveFilter) {
    this.activeFilter = value;
    this.advancedQueryService.pushActiveFilterChange(this.activeFilter);
  }

  toggleClass(event: any, cssClass: string): void {
    const hasClass = event.target.classList.contains(cssClass);

    if (hasClass) {
      this.renderer.removeClass(event.target, cssClass);
    } else {
      this.renderer.addClass(event.target, cssClass);
    }
  }

  openModal() {
    if (this.tutorialService.tutorialAction.getValue()) {
      this.tutorialService.tutorialAction.next(null);
    }
    this.modalRef = this.modalService.show(SearchInstructionsHowWhoModalComponent, {});
  }

  helpModal(key, titleString) {
    const helpContent: Array<HelpItem> = JSON.parse(localStorage.getItem('mainHeaderHelp'));
    const helpItem = helpContent.find(content => {
      return content.id.toString().trim() === key.toString().trim();
    });
    const initialState = {
      helpText: helpItem.helpText,
      title: titleString
    };
    this.modalRef = this.modalService.show(HelpComponent, {initialState});
  }

  onChildChecked() {
    this.showReport = false;
  }

  scroll(element) {
    element.nativeElement.scrollIntoView();
  }

}
