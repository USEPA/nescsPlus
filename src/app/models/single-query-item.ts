export class SingleQueryItem {
  ecological: string;
  environmental: string;
  directUse: string;
  directUser: string;

  public constructor(init?: Partial<SingleQueryItem>) {
    Object.assign(this, init);
  }
}
