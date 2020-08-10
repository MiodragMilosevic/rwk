import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRegisteredUserComponent } from './header-registered-user.component';

describe('HeaderRegisteredUserComponent', () => {
  let component: HeaderRegisteredUserComponent;
  let fixture: ComponentFixture<HeaderRegisteredUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderRegisteredUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRegisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
