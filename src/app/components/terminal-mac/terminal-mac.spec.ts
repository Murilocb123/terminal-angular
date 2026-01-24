import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalMac } from './terminal-mac';

describe('TerminalMac', () => {
  let component: TerminalMac;
  let fixture: ComponentFixture<TerminalMac>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalMac]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalMac);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
