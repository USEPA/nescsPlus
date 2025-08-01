export class ListItem {
  title: string;
  column: string;
  // These are specific styles for excel which are defined in excelStyles.xml
  style: string;
  checked: boolean;
  helpText: string;
  children = new Array<ListItem>();
  id: string;
  visible = true;
  disable = false;
  findExpression: any;

  public constructor(init?: Partial<ListItem>) {
    Object.assign(this, init);
  }
}
