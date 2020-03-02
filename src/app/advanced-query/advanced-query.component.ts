import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AppService} from '../services/app.service';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {ListItem} from '../models/listItem';
import {Subscription} from 'rxjs';
import {ActiveFilter} from '../models/enums';
import {SearchInstructionsHowWhoModalComponent} from '../modals/search-instructions-how-who-modal/search-instructions-how-who-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {HelpItem} from '../models/help-item';
import {HelpComponent} from '../modals/help/help.component';


@Component({
  selector: 'app-advanced-query',
  templateUrl: './advanced-query.component.html',
  styleUrls: ['./advanced-query.component.scss'],
  providers: [AdvancedQueryService]
})

export class AdvancedQueryComponent implements OnInit, OnDestroy {
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

  constructor(private renderer: Renderer2, private appService: AppService, private advancedQueryService: AdvancedQueryService,
              private modalService: BsModalService) {

    this.listChanges = this.advancedQueryService.listChange$.subscribe(resultActive => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.advancedQueryService.processClick(this.navItems);
      });
    });
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

  ngOnDestroy(): void {
    this.listChanges.unsubscribe();
  }

  generateReport(reRender: boolean) {
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

}
