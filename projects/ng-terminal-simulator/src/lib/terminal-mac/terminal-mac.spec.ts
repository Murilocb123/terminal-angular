import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminalMac } from './terminal-mac';

// Mock ResizeObserver for test environment
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  (window as any).ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe('TerminalMac', () => {
  let component: TerminalMac;
  let fixture: ComponentFixture<TerminalMac>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalMac]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalMac);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default theme as dark', () => {
    expect(component.theme).toBe('dark');
  });

  it('should have correct line prompt format', () => {
    component.username = 'testuser';
    component.hostname = 'testhost';
    component.promptSymbol = '% ';
    const expectedPrompt = `${component.username}${component.at}${component.hostname}${component.tilde}${component.promptSymbol}`;
    expect(component.linePrompt).toBe(expectedPrompt);
  });

  it('should have correct title format', () => {
    component.username = 'testuser';
    component.interpreter = 'zsh';
    expect(component.title).toContain('testuser');
    expect(component.title).toContain('zsh');
  });
});
