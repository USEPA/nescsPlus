import {Column} from './column.model';


export class NavArray {
  arrayName: string;
  columnArray: Array<Column>;

  public constructor(init?: Partial<NavArray>) {
    Object.assign(this, init);
  }
}
