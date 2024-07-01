import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUIOperationsComponent } from './main-uioperations.component';

describe('MainUIOperationsComponent', () => {
  let component: MainUIOperationsComponent;
  let fixture: ComponentFixture<MainUIOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainUIOperationsComponent]
    });
    fixture = TestBed.createComponent(MainUIOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
