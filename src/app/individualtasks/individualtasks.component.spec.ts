import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualtasksComponent } from './individualtasks.component';

describe('IndividualtasksComponent', () => {
  let component: IndividualtasksComponent;
  let fixture: ComponentFixture<IndividualtasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualtasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
