import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxsComponent } from './txs.component';

describe('TxsComponent', () => {
  let component: TxsComponent;
  let fixture: ComponentFixture<TxsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
