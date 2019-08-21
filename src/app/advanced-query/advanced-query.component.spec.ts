import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedQueryComponent } from './advanced-query.component';

describe('AdvancedQueryComponent', () => {
  let component: AdvancedQueryComponent;
  let fixture: ComponentFixture<AdvancedQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
