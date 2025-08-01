import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {ListItem} from '../../models/listItem';
import {AdvancedQueryService} from '../../services/advanced-query.service';

@Component({
    selector: 'app-toggle-items',
    templateUrl: './toggle-items.component.html',
    styleUrls: ['./toggle-items.component.scss'],
    standalone: false
})
export class ToggleItemsComponent implements OnInit {
  @Input() data;

  constructor(private advancedQueryService: AdvancedQueryService) {
  }

  ngOnInit() {
  }

  toggleEntry(check: boolean) {
    this.toggleSelect(this.data, check, 0);
    this.advancedQueryService.listClick(true);
  }

  toggleSelect(data: Array<ListItem>, check: boolean, level: number): void {

    data.forEach((item) => {
      item.checked = check;

      if (item.children.length) {
        this.toggleSelect(item.children, check, level + 1);
      }
    });
  }

}
