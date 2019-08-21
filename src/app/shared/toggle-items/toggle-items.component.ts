import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {ListItem} from '../../models/listItem';
import {AdvancedQueryService} from '../../services/advanced-query.service';

@Component({
  selector: 'app-toggle-items',
  templateUrl: './toggle-items.component.html',
  styleUrls: ['./toggle-items.component.scss']
})
export class ToggleItemsComponent implements OnInit {
  @Input() data;

  constructor(private advancedQueryService: AdvancedQueryService) {
  }

  ngOnInit() {
  }

  toggleEntry(check: boolean) {
    this.toggleSelect(this.data, check);
    this.advancedQueryService.listClick(true);
  }

  toggleSelect(data: Array<ListItem>, check: boolean): void {
    data.forEach((item) => {
      item.checked = check;
      if (item.children.length) {
        this.toggleSelect(item.children, check);
      }
    });
  }

}
