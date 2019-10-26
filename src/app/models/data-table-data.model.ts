import {Column} from './column.model';
import {Data} from './data.model';


export class DataTableData {
  columns: Array<Column>;
  data: Array<Data>;

  public constructor(init?: Partial<DataTableData>) {
    Object.assign(this, init);
  }
}
