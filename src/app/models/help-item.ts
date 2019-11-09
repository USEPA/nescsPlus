export class HelpItem {
  id: string;
  helpText: string;

  public constructor(init?: Partial<HelpItem>) {
    Object.assign(this, init);
  }
}
