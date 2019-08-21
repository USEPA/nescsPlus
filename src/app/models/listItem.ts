export class ListItem {
  title: string;
  column: string;
  enabled: boolean;
  checked: boolean;
  children = new Array<ListItem>();

  public constructor(init?: Partial<ListItem>) {
    Object.assign(this, init);
  }
}
