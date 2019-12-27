export class ToggleItem {
  column: string;
  title: string;
  checked: false;
  children: Array<ToggleItem> = new Array<ToggleItem>();

  public constructor(init?: Partial<ToggleItem>) {
    Object.assign(this, init);
  }
}
