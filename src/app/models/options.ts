export class Options {
  public text: string;
  public id: string;

  public constructor(init?: Partial<Options>) {
    Object.assign(this, init);
  }
}
