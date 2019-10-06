import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleQueryTableComponent } from './single-query-table.component';

describe('SingleQueryTableComponent', () => {
  let component: SingleQueryTableComponent;
  let fixture: ComponentFixture<SingleQueryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleQueryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleQueryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
