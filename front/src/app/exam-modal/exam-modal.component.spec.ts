import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamModalComponent } from './exam-modal.component';

describe('ExamModalComponent', () => {
  let component: ExamModalComponent;
  let fixture: ComponentFixture<ExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
