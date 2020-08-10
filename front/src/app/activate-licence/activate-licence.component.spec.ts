import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateLicenceComponent } from './activate-licence.component';

describe('ActivateLicenceComponent', () => {
  let component: ActivateLicenceComponent;
  let fixture: ComponentFixture<ActivateLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
