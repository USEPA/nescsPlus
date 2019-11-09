import {Injectable} from '@angular/core';
import {ListItem} from '../models/listItem';
import {Constants} from '../models/constants';
import {NavArray} from '../models/nav-array.model';
import {ActiveFilter} from '../models/enums';

declare var $;

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  row: number;
  childrenExcelRow: Map<number, Array<string>>;
  levelIndicator = '&gt; ';
  workingRowCounter: number;

  constructor() {
  }

  exportData(xlsx, navigationItems: Array<ListItem>, toggleColumns: Array<ListItem>, data, activeFilter: ActiveFilter): void {
    this.modifyXLSStyle(xlsx.xl);
    xlsx.xl.worksheets['sheet1.xml'] = this.generateFirstSheet(toggleColumns, data);
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
    newSheet += this.addLineRow();
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Environmental Classes and subclasses</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    this.childrenExcelRow = new Map<number, Array<string>>();
    newSheet += this.getXmlFirstRow(toggleColumns, navigationItems[0], Constants.ENVIRONMENTAL_COLUMN_ARRAY);
    newSheet += this.addLineRow();
    newSheet += '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3">' +
      '<is>' +
      '<t>Ecological End-Product Classes</t>' +
      '</is>' +
      '</c>' +
      '</row>';
    newSheet += this.getCustomOuput(toggleColumns, navigationItems[1], Constants.ECOLOGICAL_COLUMN_ARRAY);
    newSheet += this.addLineRow();
    if (activeFilter === ActiveFilter.Direct) {
      newSheet += '<row  r="' + (++this.row) + '">' +
        '<c t="inlineStr" r="B' + this.row + '" s="3">' +
        '<is>' +
        '<t>Direct Use Classes and Subclasses</t>' +
        '</is>' +
        '</c>' +
        '</row>';
      newSheet += this.getXmlFirstRow(toggleColumns, navigationItems[2], Constants.DIRECT_USE_COLUMN_ARRAY);
      newSheet += this.addLineRow();
      newSheet += '<row  r="' + (++this.row) + '">' +
        '<c t="inlineStr" r="B' + this.row + '" s="3">' +
        '<is>' +
        '<t>Direct User Classes and Subclasses</t>' +
        '</is>' +
        '</c>' +
        '</row>';
      newSheet += this.getXmlFirstRow(toggleColumns, navigationItems[3], Constants.DIRECT_USER_COLUMN_ARRAY);
    } else {
      newSheet += '<row  r="' + (++this.row) + '">' +
        '<c t="inlineStr" r="B' + this.row + '" s="3">' +
        '<is>' +
        '<t>Beneficiary class</t>' +
        '</is>' +
        '</c>' +
        '</row>';
      newSheet += this.getXmlFirstRow(toggleColumns, navigationItems[4], Constants.BENEFICIARY_COLUMN_ARRAY);
    }
    newSheet += this.addLineRow();
    newSheet += '</sheetData>' +
      '</worksheet>';
    xlsx.xl.worksheets['sheet2.xml'] = $.parseXML(newSheet);
  }

  getCustomOuput(columnsToggledArray: Array<ListItem>, navigationItem: ListItem, navDefinitionArray: NavArray): string {
    const workingMap = new Map<number, Array<string>>();
    const columnIndex = Constants.EXCEL_COLUMNS[1];
    this.workingRowCounter = this.row;
    this.getNextRows(workingMap, '', columnIndex, columnsToggledArray, navigationItem.children, navDefinitionArray, 0);
    return this.resultMapToString(workingMap);
  }

  getXmlFirstRow(columnsToggledArray: Array<ListItem>, navigationItem: ListItem, navDefinitionArray: NavArray): string {
    const workingMap = new Map<number, Array<string>>();
    const initialRow = this.row + 1;
    const initialColumnIndex = 1;
    const value = navDefinitionArray.columnArray[0];
    let workingColumnIndex = initialColumnIndex;
    const foundToggleColumn = columnsToggledArray.find((item: ListItem) => {
      return item.column === value.columnName;
    });
    navigationItem.children.forEach((dataItem: ListItem) => {
      this.workingRowCounter = initialRow;
      const workingRowArray = workingMap.get(this.workingRowCounter) || new Array<string>();
      // Since Filters are hierarchical if parent is not checked , all items below do not show
      if (dataItem.checked) {
        const columnIndex = Constants.EXCEL_COLUMNS[workingColumnIndex];
        // If Column is hidden disregard filter
        if (foundToggleColumn.checked) {
          workingRowArray.push('<c t="inlineStr" r="' + columnIndex + this.workingRowCounter + '" s="3">' +
            '<is>' +
            '<t>' + dataItem.title + '</t>' +
            '</is>' +
            '</c>'
          );
          workingMap.set(this.workingRowCounter, workingRowArray);
        }
        if (dataItem.children) {
          this.getNextRows(workingMap, this.levelIndicator, columnIndex, columnsToggledArray, dataItem.children, navDefinitionArray, 1);
        }
        workingColumnIndex++;
      }
    });
    return this.resultMapToString(workingMap);
  }

  getNextRows(result: Map<number, Array<string>>, prependString: string, columnIndex: string,
              columnsToggledArray: Array<ListItem>, navigationItemArray: Array<ListItem>, navDefinitionArray: NavArray,
              navLevelIndex: number) {
    try {
      const currentColumn = navDefinitionArray.columnArray[navLevelIndex];
      const showColumn = columnsToggledArray.find((item: ListItem) => {
        return item.column === currentColumn.columnName;
      }).checked;
      navigationItemArray.forEach((dataItem: ListItem) => {
        if (showColumn && dataItem.checked) {
          this.workingRowCounter++;
          const workingRowArray = result.get(this.workingRowCounter) || new Array<string>();
          workingRowArray.push('<c t="inlineStr" r="' + columnIndex + this.workingRowCounter + '" s="3">' +
            '<is>' +
            '<t>' + prependString + dataItem.title + '</t>' +
            '</is>' +
            '</c>');
          result.set(this.workingRowCounter, workingRowArray);
        }
        if (dataItem.children.length) {
          this.getNextRows(result, (prependString + prependString), columnIndex, columnsToggledArray,
            dataItem.children, navDefinitionArray, navLevelIndex + 1);
        }
      });
    } catch (e) {
      console.error('e:', e, result, prependString, this.workingRowCounter, columnIndex, columnsToggledArray,
        navigationItemArray, navDefinitionArray, navLevelIndex);
    }

  }

  addLineRow() {
    return '<row  r="' + (++this.row) + '">' +
      '<c t="inlineStr" r="B' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="C' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="D' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="E' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="F' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="G' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="H' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="I' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="J' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="K' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '<c t="inlineStr" r="L' + this.row + '" s="3"><is><t>-----------------------------------------</t></is></c>' +
      '</row>';
  }


  /************************/
  /* Generate Data Sheet **/

  /************************/
  generateFirstSheet(toggleColumns: Array<ListItem>, data: Array<any>): XMLDocument {
    this.row = 1;
    let newSheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
      'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="">' +
      '<cols >' +
      this.colDefintion(toggleColumns) +
      '</cols>' +
      '<sheetData>';

    newSheet += '<row  r="' + this.row + '">';
    toggleColumns.forEach(column => {
      const style = 32 + (parseInt(column.style) || 0);
      newSheet += '<c t="inlineStr" r="' + this.row + '" s="' + style + '">' +
        '<is>' +
        '<t>' + column.title + '</t>' +
        '</is>' +
        '</c>';
    });
    newSheet += '</row>';
    this.row++;
    data.forEach(dataRow => {
      let columnIndex = 0;
      newSheet += '<row  r="' + this.row + '">';
      dataRow.forEach((cell) => {
        const cellText = typeof cell === 'string' ? cell : 'nothing';
        const column = Constants.EXCEL_COLUMNS[columnIndex];
        const columnStyle = toggleColumns[columnIndex].style || 0;

        newSheet += '<c t="inlineStr" r="' + column + this.row + '" s="' + columnStyle + '">' +
          '<is>' +
          '<t>' + cellText + '</t>' +
          '</is>' +
          '</c>';
        columnIndex++;
      });
      newSheet += '</row>';
      this.row++;
    });
    newSheet += '</sheetData>' +
      '</worksheet>';
    return $.parseXML(newSheet);
  }

  colDefintion(toggleColumns): string {
    let cols = '';
    toggleColumns.forEach((item, index) => {
      let hidden = ' width="20"';
      if (!item.checked) {
        hidden = ' hidden="true"';
      }
      const columnIndex = index + 1;
      cols += '<col min="' + columnIndex + '" max="' + columnIndex + '" customWidth="1"' + hidden + '/>';
    });
    return cols;
  }

  modifyXLSStyle(xl) {
    xl['styles.xml'] = new DOMParser().parseFromString(localStorage.getItem('xmlStyle'), 'text/xml');
  }

  resultMapToString(workingMap: Map<number, Array<string>>): string {
    let result = '';
    workingMap.forEach((values: Array<string>, key: number) => {
      result += '<row  r="' + key + '">' + values.join('') + '</row>';

      // check to make sure row is updated when needed
      if (this.row < key) {
        this.row = key;
      }
    });
    return result;
  }


}
