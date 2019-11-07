

export class Column {
  columnName = '';
  columnTitle = '';
  arrayIndex = 0;
  level = 0;
  findExpression: any;

  // Used to determine location of id in either FESID2244 or FEGSIDNumber
  index: number;

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }
}
