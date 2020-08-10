import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfVideosComponent } from './list-of-videos.component';

describe('ListOfVideosComponent', () => {
  let component: ListOfVideosComponent;
  let fixture: ComponentFixture<ListOfVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
