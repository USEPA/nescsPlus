

export class Column {
  columnName = '';
  columnTitle = '';
  // Used on web to define class for styling of Datatable
  className: string;
  arrayIndex = 0;
  level = 0;
  findExpression: any;

  // Used to determine location of id in either NESCSPlusID or BeneficiaryId
  index: number;

  public constructor(init?: Partial<Column>) {
    Object.assign(this, init);
  }
}
