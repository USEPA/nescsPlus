import {Column} from './column.model';


export class NavArray {
  baseName: string;
  indexColumnName: string;
  index: number;
  columnArray: Array<Column>;

  public constructor(init?: Partial<NavArray>) {
    Object.assign(this, init);
  }
}
