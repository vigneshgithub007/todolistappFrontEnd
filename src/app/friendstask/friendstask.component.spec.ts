import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendstaskComponent } from './friendstask.component';

describe('FriendstaskComponent', () => {
  let component: FriendstaskComponent;
  let fixture: ComponentFixture<FriendstaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendstaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendstaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
