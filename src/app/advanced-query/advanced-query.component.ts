import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AppService} from '../services/app.service';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {ListItem} from '../models/listItem';
import {Subscription} from 'rxjs';
import {ActiveFilter} from '../models/enums';

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

  constructor(private renderer: Renderer2, private appService: AppService, private advancedQueryService: AdvancedQueryService) {

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

}
