import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleColumnsComponent } from './toggle-columns.component';

describe('ToggleColumnsComponent', () => {
  let component: ToggleColumnsComponent;
  let fixture: ComponentFixture<ToggleColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
