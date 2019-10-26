import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ListItem} from '../models/listItem';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {HelperService} from '../services/helper.service';
import {ExcelService} from '../services/excel.service';
import {DataService} from '../services/data.service';
import {DataTableData} from '../models/data-table-data.model';
import {Constants} from '../models/constants';

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
  selectedRemovedColumns: Set<ListItem>;
  toggleHideColumns: Array<string> = new Array<string>();
  modalRef: BsModalRef;
  dtOptions: any;
  dataTable: any;
  columns: Array<string>;
  displayOptions: DataTableData;
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
        this.renderDataTable();
      });
    });
    this.toggleColumnChange = this.toggleColumnsService.toggleColumnChange$.subscribe(columns => {
      this.selectedRemovedColumns = new Set<ListItem>(columns);
      this.renderDataTable();
    });
    this.activeFilterChange = this.advancedQueryService.activeFilterChange$.subscribe(resultActive => {
      setTimeout(() => {
        this.activeFilter = resultActive;
        this.renderDataTable();
      });
    });
  }

  ngOnInit(): void {
    this.selectedRemovedColumns = this.toggleColumnsService.getColumnToggleHideList();
  }

  renderDataTable(): void {
    const self = this;
    let displayOptions = DataService.getData();
    console.log('displayOptions', displayOptions);
    displayOptions = DataService.filterTable(displayOptions, this.navigationItems);
    displayOptions = DataService.removeColumns(this.selectedRemovedColumns, displayOptions);
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
      data: DataService.returnArray(displayOptions),
      columns: DataService.returnColumnArray(displayOptions.columns),
      lengthMenu: [[10, 25, 50, 100, 200, -1], [10, 25, 50, 100, 200, 'All']],
      fixedHeader: {
        header: false,
        adjust: true
      }
    };
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
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
    const selectedRemovedColumns = DataService.extractProp(this.selectedRemovedColumns, 'column');
    filterOptions = filterOptions.filter((element) => {
      return !selectedRemovedColumns.has(element.column);
    });
    return filterOptions;
  }

  extraSheet(xlsx): void {
    let columnsToHide = DataService.extractProp(this.selectedRemovedColumns, 'title');
    columnsToHide = HelperService.union(columnsToHide, new Set(Constants.ANCILIARY_COLUMN_ARRAY));
    const dataTableAPI = this.dataTable.DataTable();
    const data = Object.values(dataTableAPI.rows({selected: true}).data());
    data.unshift(dataTableAPI.settings().init().columns.map((item) => {
      return item.title;
    }));
    this.excelService.exportData(xlsx, this.navigationItems, data, columnsToHide);
  }

}
