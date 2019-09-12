import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ListItem} from '../models/listItem';
import {ToggleColumnsService} from '../services/toggle-columns.service';
import {HelperService} from '../services/helper.service';
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
  childrenExcelRow: Map<number, Array<string>>;

  constructor(private advancedQueryService: AdvancedQueryService,
              private modalService: BsModalService,
              private toggleColumnsService: ToggleColumnsService,
              private helper: HelperService) {
    this.navigationChanges = this.advancedQueryService.pushNavigationChange$.subscribe(resultActive => {
      // Setting value through async call to avoid error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        console.log('resultActuve', resultActive);
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
    let filterOptions = new Array(
      {column: 'EnvironmentalClass', arrayIndex: 0, level: 0},
      {column: 'EnvironmentalSubclass', arrayIndex: 0, level: 1},
      {column: 'Ecological End-Product Class', arrayIndex: 1, level: 0},
    );


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
    // Add sheet2 to [Content_Types].xml => <Types>
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
    this.row = 1;
    const today = new Date();
    const cMonth = today.getMonth() + 1;
    const cDay = today.getDate();
    const dateNow = ((cMonth < 10) ? '0' + cMonth : cMonth) + '-' + ((cDay < 10) ? '0' + cDay : cDay) + '-' + today.getFullYear();
    let newSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
      'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">' +
      '<cols >' +
      '<col min="1" max="1" width="24.7" customWidth="1"/>' +
      '<col min="2" max="2" width="37.7" customWidth="1"/>' +
      '</cols>' +
      '<sheetData>' +
      '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="A' + this.row + '" s="7">' +
      '<is>' +
      '<t>Information sheet</t>' +
      '</is>' +
      '</c>' +
      '</row>' +
      '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="A' + this.row + '" s="2">' +
      '<is>' +
      '<t>Date</t>' +
      '</is>' +
      '</c>' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>' + dateNow + '</t>' +
      '</is>' +
      '</c>' +
      '</row>' +
      '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="A' + this.row + '" s="2">' +
      '<is>' +
      '<t>Selected Values:</t>' +
      '</is>' +
      '</c>' +
      '</row>';

    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Environmental Classes and subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlFirstRow(this.navigationItems[0].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Ecological End-Product Classes</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlOneRow(this.navigationItems[1].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Direct Use Classes and Subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    // this.childrenExcelRow = new Map<number, Array<string>>();
    // newSheet += this.getXmlFirstRow(this.navigationItems[2].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Direct User Classes and Subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    // this.childrenExcelRow = new Map<number, Array<string>>();
    // newSheet += this.getXmlFirstRow(this.navigationItems[3].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Beneficiary class</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlFirstRow(this.navigationItems[4].children, 2);
    newSheet += '</sheetData>' +
      '<mergeCells count="1">' +
      '<mergeCell  ref="A1:B1"/>' +
      '</mergeCells>' +
      '</worksheet>';
    console.log('newSheet', newSheet, this.row);
    xlsx.xl.worksheets['sheet2.xml'] = $.parseXML(newSheet);
  }

  getXmlFirstRow(items: Array<ListItem>, columnIndex: number): string {
    let result = '';
    let initialRow = this.row + 1;
    result += '<row  r="' + initialRow + '">';
    items.forEach((item) => {
      if (item.checked) {
        const column = Constants.EXCEL_COLUMNS[columnIndex];
        columnIndex++;
        result += '<c t="inlineStr" r="' + column + (this.row + 1) + '" s="3">' +
          '<is>' +
          '<t>' + item.title + '</t>' +
          '</is>' +
          '</c>';
        if (item.children) {
          this.getXmlRows(item.children, columnIndex, initialRow);
          columnIndex++;
        }
      }
    });
    result += '</row>';
    this.childrenExcelRow.forEach((item) => {
      console.log('item', item);
      const rowNumber = ++initialRow;
      let cell = item.join('');
      cell = cell.replace(/r\=\"\D(\d+)\"/g, (match) => {
        console.log('match', match, match.replace(/\d+/, rowNumber.toString()));
        return match.replace(/\d+/, rowNumber.toString());
      });
      result += '<row  r="' + rowNumber + '">' + cell + '</row>';
    });

    this.row = initialRow;
    console.log('childrenRow', this.childrenExcelRow);
    return result;
  }

  getXmlOneRow(items: Array<ListItem>, columnIndex: number): string {
    let result = '';
    const column = Constants.EXCEL_COLUMNS[columnIndex];
    items.forEach((item) => {
      this.row++;
      result += '<row  r="' + this.row + '">' +
        '<c t="inlineStr" r="' + column + this.row + '" s="3">' +
        '<is>' +
        '<t>' + item.title + '</t>' +
        '</is>' +
        '</c>' +
        '</row>';
    });

    return result;
  }

  getXmlRows(items: Array<ListItem>, columnIndex: number, row: number): void {

    items.forEach((item) => {
      if (item.checked) {
        const column = Constants.EXCEL_COLUMNS[columnIndex];
        const excelRow = ++row;
        console.log('row', column, excelRow);
        const rowArray = this.childrenExcelRow.get(row) || new Array<string>();
        rowArray.push('<c t="inlineStr" r="' + column + excelRow + '" s="3">' +
          '<is>' +
          '<t>' + item.title + '</t>' +
          '</is>' +
          '</c>');
        this.childrenExcelRow.set(excelRow, rowArray);
        if (item.children) {
          const nextColumnIndex = columnIndex + 1;
          this.getXmlRows(item.children, nextColumnIndex, row);
        }
      }
    });
  }
}
