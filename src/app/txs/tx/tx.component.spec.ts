import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxComponent } from './tx.component';

describe('TxComponent', () => {
  let component: TxComponent;
  let fixture: ComponentFixture<TxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
