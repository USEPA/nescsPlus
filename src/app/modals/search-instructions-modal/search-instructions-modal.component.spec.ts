import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInstructionsModalComponent } from './search-instructions-modal.component';

describe('SearchInstructionsModalComponent', () => {
  let component: SearchInstructionsModalComponent;
  let fixture: ComponentFixture<SearchInstructionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchInstructionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInstructionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
