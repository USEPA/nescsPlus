import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {SingleQueryItem} from '../../models/single-query-item';
import {SingleQueryService} from '../../services/single-query.service';
import {DeleteModalComponent} from '../../modals/delete-modal/delete-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Constants} from '../../models/constants';
import {SingleQueryAction} from '../../models/single-query-action';
import {Action} from '../../models/enums';

declare var $;

@Component({
    selector: 'app-single-query-table',
    templateUrl: './single-query-table.component.html',
    styleUrls: ['./single-query-table.component.scss'],
    standalone: false
})
export class SingleQueryTableComponent implements OnInit, AfterViewInit, OnDestroy {
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
  actionItem: SingleQueryAction = new SingleQueryAction();

  constructor(private modalService: BsModalService, private singleQueryService: SingleQueryService) {
    this.displayOptions = this.singleQueryService.prepDisplay();
  }

  ngOnInit() {
    console.log('init single-query-table');
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
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
    const today = new Date();
    const cMonth = today.getMonth() + 1;
    const cDay = today.getDate();
    const dateNow = ((cMonth < 10) ? '0' + cMonth : cMonth) + '-' + ((cDay < 10) ? '0' + cDay : cDay) + '-' + today.getFullYear();
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'csv', text: 'Export CSV', className: 'csvExport', customize: csv => {
            return '# National Ecosystem Services Classification System (NESCS Plus) \n' +
              '# https://www.epa.gov/eco-research/national-ecosystem-services-classification-system-nescs-plus \n \n' +
              '# Search Date: ' + dateNow + '\n' +
              '# NESCS Plus offers two options for searching. \n' +
              '# (1) These are the results from "Query All Options" which enables users to consider every possibility and build a custom table a single row at a time. \n' +
              '#      If you discover a row that is missing that should be included in the "core" set please let us know by clicking "Provide Feedback." \n' +
              '# (2) In contrast "Browse Core Options" refines the > 75000 possible combinations to a shorter "core" set of ~1000 most plausible combinations. \n \n' +
              csv;
          }
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
        if (tdExist) {
          if (element.hasClass('selected')) {
            element.removeClass('selected');
            dataTableAPI.buttons(0, '1').disable();
            this.actionItem.action = Action.Add;
            this.actionItem.title = '';
            this.singleQueryService.singleQueryAction.next(this.actionItem);
          } else {
            dataTableAPI.$('tr.selected').removeClass('selected');
            element.addClass('selected');
            dataTableAPI.buttons(0, '1').enable();
            this.actionItem.action = Action.Edit;
            this.actionItem.title = $(element.find('td')[0]).html();
            this.sendState(this.actionItem.title);
          }
        }
      });
    }
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.dataTable = this.nativeDataTable.DataTable(this.dtOptions);
    if ($('#singleDataTablesButtons').length) {
      $('#singleDataTablesButtons').html('');
    }
    // Reconfigure DataTable elements to wrap scroll around Table
    this.dataTable.buttons().containers().appendTo($('#singleDataTablesButtons'));
    $('#singleDataTableSearch').html('');
    $('#singleDataTableSearch').html($('.dataTables_filter'));
  }

  sendState(key: string) {
    console.log('sendState');
    const editItem = new Map<string, SingleQueryItem>();
    editItem.set(key, this.singleQueryMap.get(key));
    this.editItem.emit(editItem);
    this.singleQueryService.singleQueryAction.next(this.actionItem);
  }

  deleteRow(e, dt, node, config): void {
    const initialState = {key: dt.rows('.selected', {selected: true}).data()[0][0]};
    this.deleteModalRef = this.modalService.show(DeleteModalComponent, {initialState});
  }

}
