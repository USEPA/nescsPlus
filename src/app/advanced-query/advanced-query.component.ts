import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AppService} from '../services/app.service';
import {environment} from '../../environments/environment';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {ListItem} from '../models/listItem';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-advanced-query',
  templateUrl: './advanced-query.component.html',
  styleUrls: ['./advanced-query.component.scss'],
  providers: [AdvancedQueryService]
})

export class AdvancedQueryComponent implements OnInit, OnDestroy {
  activeFilter = '';
  showReport = false;
  navItems: Array<ListItem>;
  level = 0;
  listChanges: Subscription;
  disableChildren = false;

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
  }

  ngOnDestroy(): void {
    this.listChanges.unsubscribe();
  }

  generateReport(reRender: boolean) {
    this.showReport = true;
  }


  toggleClass(event: any, cssClass: string): void {
    const hasClass = event.target.classList.contains(cssClass);

    if (hasClass) {
      this.renderer.removeClass(event.target, cssClass);
    } else {
      this.renderer.addClass(event.target, cssClass);
    }
  }

  toggleActiveFilter(activeFilter: string) {
    this.activeFilter = activeFilter;
    this.advancedQueryService.pushActiveFilterChange(activeFilter);
  }
}
