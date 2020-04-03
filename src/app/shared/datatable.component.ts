import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ListItem} from '../models/listItem';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {HelperService} from '../services/helper.service';
import {ExcelService} from '../services/excel.service';
import {DataService} from '../services/data.service';
import {ActiveFilter} from '../models/enums';
import {Constants} from '../models/constants';
import 'datatables.net-bs4';

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
  @Input() activeFilter: ActiveFilter;
  selectedColumns: Set<ListItem>;
  modalRef: BsModalRef;
  dtOptions: any;
  nativeDataTable: any;
  dataTable: any;
  columns: Array<string>;
  navigationChanges: Subscription;
  activeFilterChange: Subscription;
  toggleColumnChange: Subscription;
  row = 1;
  CONTACT_US = Constants.CONTACT_US;

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
      this.selectedColumns = new Set<ListItem>(columns);
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
    this.selectedColumns = this.toggleColumnsService.getColumnToggleHideList();
  }

  renderDataTable(): void {
    const self = this;
    const dataTableData = DataService.getTableData(this.navigationItems, this.activeFilter, this.selectedColumns);
    this.dtOptions = {
      destroy: true,
      dom: 'Bfrtip',
      columns: DataService.returnDataColumnArray(dataTableData.columns, this.selectedColumns),
      data: DataService.returnArray(dataTableData),
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Export',
          customize: this.customExport.bind(self)
        }, {
          text: 'Hide/Show Columns',
          action: (e, dt, node, config) => {
            this.openModal(this.template);
          }
        }
      ],
      lengthMenu: [[10, 25, 50, 100, 200, -1], [10, 25, 50, 100, 200, 'All']]
    };
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    console.log('this', this.table);
    this.nativeDataTable = $(this.table.nativeElement);
    this.dataTable = this.nativeDataTable.DataTable(this.dtOptions);

    // Reconfigure DataTable elements to wrap scroll around Table
    const existingElements = $('#dataTablesButtons').find('button.buttons-excel').length;
    if (!existingElements) {
      this.dataTable.buttons().containers().appendTo($('#dataTablesButtons'));
    }
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

  customExport(xlsx): void {
    const data = DataService.returnArray(DataService.getExportData(this.navigationItems, this.activeFilter));
    const toggleColumns = DataService.returnFlatListItemArray(Array.from(this.selectedColumns));
    this.excelService.exportData(xlsx, this.navigationItems, toggleColumns, data, this.activeFilter);
  }

}
