import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleItemsComponent } from './toggle-items.component';

describe('ToggleItemsComponent', () => {
  let component: ToggleItemsComponent;
  let fixture: ComponentFixture<ToggleItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
