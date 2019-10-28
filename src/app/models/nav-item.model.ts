
export class NavItem {
  name: string;
  dataPoint: string;
  keys: Array<string>;

  public constructor(init?: Partial<NavItem>) {
    Object.assign(this, init);
  }
}
