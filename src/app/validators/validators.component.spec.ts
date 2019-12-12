import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorsComponent } from './validators.component';

describe('ValidatorsComponent', () => {
  let component: ValidatorsComponent;
  let fixture: ComponentFixture<ValidatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
