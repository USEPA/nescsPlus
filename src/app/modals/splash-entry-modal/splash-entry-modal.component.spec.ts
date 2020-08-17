import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashEntryModalComponent } from './splash-entry-modal.component';

describe('SplashEntryModalComponent', () => {
  let component: SplashEntryModalComponent;
  let fixture: ComponentFixture<SplashEntryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashEntryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
