import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {SingleQueryItem} from '../../models/single-query-item';
import {SingleQueryService} from '../../services/single-query.service';
import {DeleteModalComponent} from '../../modals/delete-modal/delete-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Constants} from '../../models/constants';

declare var $;

@Component({
  selector: 'app-single-query-table',
  templateUrl: './single-query-table.component.html',
  styleUrls: ['./single-query-table.component.scss']
})
export class SingleQueryTableComponent implements OnInit, AfterViewInit {
  @ViewChild('singleDataTable', {static: false}) table;
  @Output() editItem: EventEmitter<Map<string, SingleQueryItem>> = new EventEmitter<Map<string, SingleQueryItem>>();
  @Output() setAction: EventEmitter<string> = new EventEmitter<string>();
  singleQuerySubscription: Subscription;
  singleQueryMap: Map<string, SingleQueryItem>;
  deleteModalRef: BsModalRef;
  dtOptions: any;
  nativeDataTable: any;
  dataTable: any;
  displayOptions: any;
  CONTACT_US = Constants.CONTACT_US;

  constructor(private modalService: BsModalService, private singleQueryService: SingleQueryService) {
    this.displayOptions = this.singleQueryService.prepDisplay();
  }

  ngOnInit() {
    console.log('init single-query-table');
  }

  ngAfterViewInit(): void {
    this.renderDataTable();
    this.singleQuerySubscription = this.singleQueryService.singleQueryMap.subscribe(
      singleQueryMap => {
        this.singleQueryMap = singleQueryMap;
        this.displayOptions = this.singleQueryService.prepDisplay();
        this.renderDataTable();
      }
    );
  }

  renderDataTable(): void {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'csv', text: 'Export CSV', className: 'csvExport', customize: csv => {
            return '# National Ecosystem Services Classification System (NESCS Plus) \n' +
              '# http://www.epa.gov/eco-research/NESCS \n \n' +
              '# NESCS Plus offers two options for searching. \n' +
              '# (1) These are the results from "Query All Options" which enables users to consider every possibility and build a custom table a single row at a time. \n' +
              '# If you discover a row that is missing that should be included in the "core" set please let us know by clicking "Provide Feedback." \n' +
              '# (2) In contrast "Browse Core Options" refines the > 75000 possible combinations to a shorter "core" set of ~1000 most plausible combinations. \n \n' +
              csv;
          }
        },
        {
          text: 'Edit',
          name: 'edit',
          action: this.editRow.bind(this),
          enabled: false
        },
        {
          text: 'Delete',
          name: 'delete',
          action: this.deleteRow.bind(this),
          enabled: false
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
    this.nativeDataTable = $(this.table.nativeElement);
    // Add listener once
    if (!this.dataTable) {
      this.nativeDataTable.on('click', 'tr', (event) => {
        const element = $(event.currentTarget);
        const tdExist = element.find('td').length !== 0;
        const dataTableAPI = this.nativeDataTable.DataTable();
        if (element.hasClass('selected')) {
          element.removeClass('selected');
          dataTableAPI.buttons(0, '1, 2').disable();
          this.singleQueryService.singleQueryAction.next('add');
        } else if (tdExist) {
          dataTableAPI.$('tr.selected').removeClass('selected');
          element.addClass('selected');
          dataTableAPI.buttons(0, '1, 2').enable();
          this.singleQueryService.singleQueryAction.next('edit');
        }
      });
    }
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.dataTable = this.nativeDataTable.DataTable(this.dtOptions);

    // Reconfigure DataTable elements to wrap scroll around Table
    this.dataTable.buttons().containers().appendTo($('#dataTablesButtons'));
    $('#dataTableSearch').html('');
    $('#dataTableSearch').html($('.dataTables_filter'));
  }

  editRow(e, dt, node, config): void {
    const key = dt.rows('.selected', {selected: true}).data()[0][0];
    const editItem = new Map<string, SingleQueryItem>();
    editItem.set(key, this.singleQueryMap.get(key));
    this.editItem.emit(editItem);
  }

  deleteRow(e, dt, node, config): void {
    const initialState = {key: dt.rows('.selected', {selected: true}).data()[0][0]};
    this.deleteModalRef = this.modalService.show(DeleteModalComponent, {initialState});
  }

}
