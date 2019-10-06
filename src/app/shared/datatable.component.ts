import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ListItem} from '../models/listItem';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {HelperService} from '../services/helper.service';
import {ExcelService} from '../services/excel.service';

declare var $;

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})

export class DataTableComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('dataTable', {static: false}) table;
  @ViewChild('template', {static: false}) template;
  @Input() navigationItems: Array<ListItem>;
  @Input() activeFilter: string;
  anciliaryColumns = new Set(['Importance', 'Status', 'Source', 'Notes', 'MeasurementType', 'FEGSMeasurementincludingUnits']);
  selectedRemovedColumns: Set<ListItem>;
  toggleHideColumns: Array<string> = new Array<string>();
  modalRef: BsModalRef;
  dtOptions: any;
  dataTable: any;
  columns: Array<string>;
  displayOptions: any;
  navigationChanges: Subscription;
  activeFilterChange: Subscription;
  toggleColumnChange: Subscription;
  row = 1;

  constructor(private advancedQueryService: AdvancedQueryService,
              private modalService: BsModalService,
              private toggleColumnsService: ToggleColumnsService,
              private helper: HelperService,
              private excelService: ExcelService) {
    this.navigationChanges = this.advancedQueryService.pushNavigationChange$.subscribe(resultActive => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.navigationItems = resultActive;
        // call rerender --
        this.rerender();
      });
    });
    this.activeFilterChange = this.advancedQueryService.activeFilterChange$.subscribe(resultActive => {
      setTimeout(() => {
        this.activeFilter = resultActive;
        this.rerender();
      });
    });
    this.toggleColumnChange = this.toggleColumnsService.toggleColumnChange$.subscribe(columns => {
      this.selectedRemovedColumns = new Set<ListItem>(columns);
      this.rerender();
    });
  }

  ngOnInit(): void {
    const removedFields = null;
    this.selectedRemovedColumns = this.toggleColumnsService.getColumnToggleHideList();
    this.displayOptions = this.advancedQueryService.prepDisplay(removedFields, 'data');
  }

  renderDataTable(): void {
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Export',
          customize: this.extraSheet.bind(self)
        }, {
          text: 'Hide/Show Columns',
          action: (e, dt, node, config) => {
            this.openModal(this.template);
          }
        }
      ],
      data: this.displayOptions.data,
      columns: this.displayOptions.columns,
      lengthMenu: [[10, 25, 50, 100, 200, -1], [10, 25, 50, 100, 200, 'All']],
      fixedHeader: {
        header: false,
        adjust: true
      }
    };
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
    this.rerender();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  ngAfterViewInit(): void {
    this.renderDataTable();
  }

  ngOnDestroy(): void {
    this.navigationChanges.unsubscribe();
    this.activeFilterChange.unsubscribe();
  }

  rerender(): void {
    this.filterTable(this.displayOptions.columns);
    this.hideColumns();
    const dataTableAPI = this.dataTable.DataTable();
    dataTableAPI.draw();
  }

  hideColumns(): void {
    let results = this.extractProp(this.selectedRemovedColumns, 'title');
    results = this.helper.union(results, this.anciliaryColumns);
    const dataTableAPI = this.dataTable.DataTable();
    let hideItems = [...results].map((item) => {
      const foundItem = this.displayOptions.columns.findIndex(x => x.title === item);
      if (typeof foundItem !== 'undefined' && foundItem !== -1) {
        this.toggleHideColumns = this.toggleHideColumns.filter(x => x !== foundItem);
        return foundItem;
      }
    });
    hideItems = hideItems.filter(item => typeof item !== 'undefined');
    if (hideItems) {
      hideItems.forEach((item) => {
        dataTableAPI.column(item).visible(false);
      });
    }
    this.toggleHideColumns.forEach((item) => {
      dataTableAPI.column(item).visible(true);
    });
    this.toggleHideColumns = hideItems;
  }

  filterTable(columns): void {
    const dataTableAPI = this.dataTable.DataTable();
    const filterOptions = this.getFilterOptions();
    if (filterOptions) {
      filterOptions.forEach((item) => {
        const columnItem = this.advancedQueryService.findColumnItem(item.column);
        const elementList = new Array<string>();
        // build a regex filter string with an or(|) condition
        this.getSearchList(this.navigationItems[item.arrayIndex].children, elementList, item.level, 0);
        const elementValues: string = elementList.map((element) => {
          return element.split(' ')[0]; // Return first word because search doesnt like spaces at this time - debug database.net search
        }).sort().join('|');
        const index = columns.map((column) => {
          return column.title;
        }).indexOf(columnItem[2]);

        if (index !== -1) {
          // arguments (input, isRegex?, isSmartSearch?, case-sensitive? )
          dataTableAPI.column(index).search(elementValues, true, true);
        }
      });
    }
  }

  getSearchList(items: Array<ListItem>, resultArray: Array<string>, index: number, level: number): void {
    items.forEach((item) => {
      if (index === level) {
        if (item.checked) {
          resultArray.push(item.title);
        }
      } else if (item.children.length) {
        this.getSearchList(item.children, resultArray, index, level + 1);
      }
    });
  }

  getFilterOptions(): Array<any> {
    let filterOptions = [{column: 'EnvironmentalClass', arrayIndex: 0, level: 0},
      {column: 'EnvironmentalSubclass', arrayIndex: 0, level: 1},
      {column: 'Ecological End-Product Class', arrayIndex: 1, level: 0}];


    if (this.activeFilter === 'directFilter') {
      filterOptions.push({column: 'Direct Use/Non-Use Class', arrayIndex: 2, level: 0});
      filterOptions.push({column: 'Direct Use/Non-Use Subclass I', arrayIndex: 2, level: 1});
      filterOptions.push({column: 'Direct Use/Non-Use Subclass II', arrayIndex: 2, level: 2});
      filterOptions.push({column: 'Direct User Class', arrayIndex: 3, level: 0});
      filterOptions.push({column: 'Direct User Subclass I', arrayIndex: 3, level: 1});
      filterOptions.push({column: 'Direct User Subclass II', arrayIndex: 3, level: 2});
    } else {
      filterOptions.push({column: 'BeneficiaryCategory', arrayIndex: 4, level: 0});
      filterOptions.push({column: 'BeneficiarySubcategory', arrayIndex: 4, level: 0});
    }

    // Remove Columns that are hidden
    const selectedRemovedColumns = this.extractProp(this.selectedRemovedColumns, 'column');
    filterOptions = filterOptions.filter((element) => {
      return !selectedRemovedColumns.has(element.column);
    });
    return filterOptions;
  }

  extractProp(values: Set<ListItem>, propName: string): Set<string> {
    const results = new Set<string>();
    values.forEach((item) => {
      if (!item.checked) {
        results.add(item[propName]);
      }

      if (item.children && item.children.length) {
        const tempList = this.extractProp(new Set(item.children), propName);
        if (tempList) {
          tempList.forEach(results.add, results);
        }
      }
    });
    return results;
  }

  extraSheet(xlsx): void {
    let columnsToHide = this.extractProp(this.selectedRemovedColumns, 'title');
    columnsToHide = this.helper.union(columnsToHide, this.anciliaryColumns);
    const dataTableAPI = this.dataTable.DataTable();
    const data = Object.values(dataTableAPI.rows({selected: true}).data());
    data.unshift(dataTableAPI.settings().init().columns.map((item) => {
      return item.title;
    }));
    this.excelService.exportData(xlsx, this.navigationItems, data, columnsToHide);
  }

}
