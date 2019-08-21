import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ListItem} from '../models/listItem';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {HelperService} from '../services/helper.service';


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
  selectedRemovedColumns: Set<string> = new Set<string>();
  toggleHideColumns: Array<string> = new Array<string>();
  modalRef: BsModalRef;
  dtOptions: any;
  dataTable: any;
  columns: Array<string>;
  displayOptions: any;
  navigationChanges: Subscription;
  activeFilterChange: Subscription;
  toggleColumnChange: Subscription;

  constructor(private advancedQueryService: AdvancedQueryService,
              private modalService: BsModalService,
              private toggleColumnsService: ToggleColumnsService,
              private helper: HelperService) {
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
      this.selectedRemovedColumns = new Set<string>(columns);
      this.hideColumns();
    });
  }

  ngOnInit(): void {
    const removedFields = null;
    this.displayOptions = this.advancedQueryService.prepDisplay(removedFields, 'data');
  }

  renderDataTable(): void {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'excel',
        {
          extend: 'excelHtml5',
          text: 'Excel Extended',
          customize: this.extraSheet
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
    this.hideColumns();
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
    this.hideColumns();
    this.filterTable(this.displayOptions.columns);
    const dataTableAPI = this.dataTable.DataTable();
    dataTableAPI.draw();
  }

  hideColumns(): void {
    const dataTableAPI = this.dataTable.DataTable();
    this.selectedRemovedColumns = this.helper.union(this.selectedRemovedColumns,
      new Set(['Importance', 'Status', 'Source', 'Notes', 'MeasurementType', 'FEGSMeasurementincludingUnits']));
    console.log('this.selectedRemovedColumns', this.selectedRemovedColumns);
    const hideItems = [...this.selectedRemovedColumns].map((item) => {
      console.log('item', item, this.displayOptions.columns);
      const foundItem = this.displayOptions.columns.findIndex(x => x.title === item);
      if (foundItem !== -1) {
        this.toggleHideColumns = this.toggleHideColumns.filter(x => x !== foundItem);
        return foundItem;
      }
    });
    console.log('hideItems', hideItems);
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
    const filterOptions = [
      {column: 'EnvironmentalClass', arrayIndex: 0, level: 0},
      {column: 'EnvironmentalSubclass', arrayIndex: 0, level: 1},
      {column: 'Ecological End-Product Class', arrayIndex: 1, level: 0},
    ];

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
    return filterOptions;
  }

  // buttons: [
  //   'pageLength',
  //   {
  //     extend: 'excelHtml5',
  //     text: 'Excel',
  //     customize: self.extraSheet
  //   }
  //   ]

  extraSheet(xlsx): void {// Add sheet2 to [Content_Types].xml => <Types>
    // ============================================
    let source = xlsx['[Content_Types].xml'].getElementsByTagName('Override')[1];
    let clone = source.cloneNode(true);
    clone.setAttribute('PartName', '/xl/worksheets/sheet2.xml');
    xlsx['[Content_Types].xml'].getElementsByTagName('Types')[0].appendChild(clone);

    // Add sheet relationship to xl/_rels/workbook.xml.rels => Relationships
    // =====================================================================
    source = xlsx.xl._rels['workbook.xml.rels'].getElementsByTagName('Relationship')[0];
    clone = source.cloneNode(true);
    clone.setAttribute('Id', 'rId3');
    clone.setAttribute('Target', 'worksheets/sheet2.xml');
    xlsx.xl._rels['workbook.xml.rels'].getElementsByTagName('Relationships')[0].appendChild(clone);

    // Add second sheet to xl/workbook.xml => <workbook><sheets>
    // =========================================================
    source = xlsx.xl['workbook.xml'].getElementsByTagName('sheet')[0];
    clone = source.cloneNode(true);
    clone.setAttribute('name', 'Info');
    clone.setAttribute('sheetId', '2');
    clone.setAttribute('r:id', 'rId3');
    xlsx.xl['workbook.xml'].getElementsByTagName('sheets')[0].appendChild(clone);

    // Add sheet2.xml to xl/worksheets
    // ===============================
    let removedColumns = 'All columns showing';
    if (this.selectedRemovedColumns) {
      removedColumns = Array.from(this.selectedRemovedColumns).join(', ');
    }
    const today = new Date();
    const cMonth = today.getMonth() + 1;
    const cDay = today.getDate();
    const dateNow = ((cMonth < 10) ? '0' + cMonth : cMonth) + '-' + ((cDay < 10) ? '0' + cDay : cDay) + '-' + today.getFullYear();
    const newSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
      'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">' +
      '<cols >' +
      '<col min="1" max="1" width="24.7" customWidth="1"/>' +
      '<col min="2" max="2" width="37.7" customWidth="1"/>' +
      '</cols>' +
      '<sheetData>' +
      '<row  r="1">' +
      '<c t="inlineStr" r="A1" s="7">' +
      '<is>' +
      '<t>Information sheet</t>' +
      '</is>' +
      '</c>' +
      '</row>' +
      '<row  r="2">' +
      '<c t="inlineStr" r="A2" s="2">' +
      '<is>' +
      '<t>Hidden Columns</t>' +
      '</is>' +
      '</c>' +
      '<c t="inlineStr" r="B2" s="3">' +
      '<is>' +
      '<t>' + removedColumns + '</t>' +
      '</is>' +
      '</c>' +
      '</row>' +
      '<row  r="3">' +
      '<c t="inlineStr" r="A3" s="2">' +
      '<is>' +
      '<t>Date</t>' +
      '</is>' +
      '</c>' +
      '<c t="inlineStr" r="B3" s="3">' +
      '<is>' +
      '<t>' + dateNow + '</t>' +
      '</is>' +
      '</c>' +
      '</row>' +
      '</sheetData>' +
      '<mergeCells count="1">' +
      '<mergeCell  ref="A1:B1"/>' +
      '</mergeCells>' +
      '</worksheet>';
    xlsx.xl.worksheets['sheet2.xml'] = $.parseXML(newSheet);
  }
}
