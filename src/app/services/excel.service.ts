import {Injectable} from '@angular/core';
import {AdvancedQueryService} from './advanced-query.service';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';

declare var $;

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  row: number;
  childrenExcelRow: Map<number, Array<string>>;

  constructor() {
  }

  exportData(xlsx, navigationItems, data, columnsToHide): void {
    xlsx.xl.worksheets['sheet1.xml'] = this.generateFirstSheet(data, columnsToHide);
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
      '<cols >';
    for (let i = 1; i < 30; i++) {
      newSheet += '<col min="' + i + '" max="' + i + '" width="30" customWidth="1"/>';
    }
    newSheet += '</cols>' +
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
    newSheet += this.getXmlFirstRow(navigationItems[0].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Ecological End-Product Classes</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlOneRow(navigationItems[1].children, 2);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Direct Use Classes and Subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    let navItem = navigationItems[2].children;
    newSheet = this.getCustomOuput(navItem, 2, newSheet);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Direct User Classes and Subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    navItem = navigationItems[3].children;
    newSheet = this.getCustomOuput(navItem, 3, newSheet);
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Beneficiary class</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlFirstRow(navigationItems[4].children, 2);
    newSheet += '</sheetData>' +
      '</worksheet>';
    xlsx.xl.worksheets['sheet2.xml'] = $.parseXML(newSheet);
  }

  getCustomOuput(navItem: Array<ListItem>, itemCount: number, newSheet: string): string {
    for (let i = 0; i < itemCount; i++) {
      if (navItem[i].checked) {
        newSheet += '<row  r="' + (++this.row) + '">' +
          '<c t="inlineStr" r="C' + this.row + '" s="3">' +
          '<is>' +
          '<t>' + navItem[i].title + '</t>' +
          '</is>' +
          '</c>' +
          '</row>';
        this.childrenExcelRow = new Map<number, Array<string>>();
        newSheet += this.getXmlFirstRow(navItem[i].children, 3);
      }
    }
    return newSheet;
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
      const rowNumber = ++initialRow;
      let cell = item.join('');
      cell = cell.replace(/r\=\"\D(\d+)\"/g, (match) => {
        return match.replace(/\d+/, rowNumber.toString());
      });
      result += '<row  r="' + rowNumber + '">' + cell + '</row>';
    });

    this.row = initialRow;
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

  generateFirstSheet(data, columnsToHide): XMLDocument {
    this.row = 1;
    console.log('columnsToHide', columnsToHide);
    let newSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
      'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">' +
      '<cols >' +
      this.colDefintion(data, columnsToHide) +
      '</cols>' +
      '<sheetData>';
    data.forEach((item) => {
      if (Array.isArray(item)) {
        let columnIndex = 0;
        const row = item.map((cell) => {
          return new ListItem({title: cell});
        });
        newSheet += '<row  r="' + this.row + '">';
        item.forEach((cell) => {
          const cellText = typeof cell === 'string' ? cell : 'nothing';
          const column = Constants.EXCEL_COLUMNS[columnIndex];
          newSheet += '<c t="inlineStr" r="' + column + this.row + '" s="3">' +
            '<is>' +
            '<t>' + cellText + '</t>' +
            '</is>' +
            '</c>';
          columnIndex++;
        });
        newSheet += '</row>';
        this.row++;
      }
    });
    newSheet += '</sheetData>' +
      '</worksheet>';
    return $.parseXML(newSheet);
  }

  colDefintion(data, columnsToHide: Set<string>): string {
    let cols = '';
    data[0].forEach((item, index) => {
      let hidden = ' width="20"';
      if (columnsToHide.has(item)) {
        hidden = ' hidden="true"';
      }
      const columnIndex = index + 1;
      cols += '<col min="' + columnIndex + '" max="' + columnIndex + '" customWidth="1"' + hidden + '/>';
    });
    return cols;
  }


}
