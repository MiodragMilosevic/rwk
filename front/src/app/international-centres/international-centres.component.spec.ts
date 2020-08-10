import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalCentresComponent } from './international-centres.component';

describe('InternationalCentresComponent', () => {
  let component: InternationalCentresComponent;
  let fixture: ComponentFixture<InternationalCentresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternationalCentresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
