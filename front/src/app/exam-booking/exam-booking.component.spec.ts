import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamBookingComponent } from './exam-booking.component';

describe('ExamBookingComponent', () => {
  let component: ExamBookingComponent;
  let fixture: ComponentFixture<ExamBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
