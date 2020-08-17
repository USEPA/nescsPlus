import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashEntryCustomModalComponent } from './splash-entry-custom-modal.component';

describe('SplashEntryCustomModalComponent', () => {
  let component: SplashEntryCustomModalComponent;
  let fixture: ComponentFixture<SplashEntryCustomModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashEntryCustomModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashEntryCustomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
