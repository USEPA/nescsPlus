

export class Column {
  arrayName = '';
  columnName = '';
  columnTitle = '';
  arrayIndex = 0;
  level = 0;

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }
}
