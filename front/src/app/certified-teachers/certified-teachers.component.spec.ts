import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedTeachersComponent } from './certified-teachers.component';

describe('CertifiedTeachersComponent', () => {
  let component: CertifiedTeachersComponent;
  let fixture: ComponentFixture<CertifiedTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertifiedTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifiedTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
