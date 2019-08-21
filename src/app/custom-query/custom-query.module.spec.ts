import { CustomQueryModule } from './custom-query.module';

describe('CustomQueryModule', () => {
  let customQueryModule: CustomQueryModule;

  beforeEach(() => {
    customQueryModule = new CustomQueryModule();
  });

  it('should create an instance', () => {
    expect(customQueryModule).toBeTruthy();
  });
});
