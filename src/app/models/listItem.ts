export class ListItem {
  title: string;
  column: string;
  style: string;
  checked: boolean;
  id: string;
  children = new Array<ListItem>();

  public constructor(init?: Partial<ListItem>) {
    Object.assign(this, init);
  }
}
