import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInstructionsHowWhoModalComponent } from './search-instructions-how-who-modal.component';

describe('SearchInstructionsHowWhoModalComponent', () => {
  let component: SearchInstructionsHowWhoModalComponent;
  let fixture: ComponentFixture<SearchInstructionsHowWhoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchInstructionsHowWhoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInstructionsHowWhoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
