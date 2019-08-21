import { AdvancedQueryModule } from './advanced-query.module';

describe('AdvancedQueryModule', () => {
  let advancedQueryModule: AdvancedQueryModule;

  beforeEach(() => {
    advancedQueryModule = new AdvancedQueryModule();
  });

  it('should create an instance', () => {
    expect(advancedQueryModule).toBeTruthy();
  });
});
