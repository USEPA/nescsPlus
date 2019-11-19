import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToggleColumnsService} from '../../services/toggle-columns.service';
import {ListItem} from '../../models/listItem';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-toggle-columns',
  templateUrl: './toggle-columns.component.html',
  styleUrls: ['./toggle-columns.component.scss']
})
export class ToggleColumnsComponent implements OnInit, OnDestroy {
  data: Set<ListItem>;
  serviceName = 'ToggleColumnsService';
  level = 0;
  disableChildren = false;
  signalColumnChange: Subscription;

  constructor(private toggleColumnsService: ToggleColumnsService ) {
    this.signalColumnChange = this.toggleColumnsService.signalColumnChange$.subscribe(resultActive => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.toggleColumnsService.processClick(this.data);
      });
    });
  }

  ngOnInit() {
    this.data = this.toggleColumnsService.getColumnToggleHideList();
  }

  ngOnDestroy(): void {
    this.toggleColumnsService.saveColumnFilterOptions(this.data);
    this.signalColumnChange.unsubscribe();
  }

}
