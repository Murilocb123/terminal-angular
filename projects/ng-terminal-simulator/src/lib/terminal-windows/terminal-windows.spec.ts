import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminalWindows } from './terminal-windows';

describe('TerminalWindows', () => {
  let component: TerminalWindows;
  let fixture: ComponentFixture<TerminalWindows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalWindows]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalWindows);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default theme as dark', () => {
    expect(component.theme).toBe('dark');
  });

  it('should have default interpreter as cmd', () => {
    expect(component.interpreter).toBe('cmd');
  });

  it('should generate correct title for CMD', () => {
    component.interpreter = 'cmd';
    expect(component.title).toBe('Command Prompt');
  });

  it('should generate correct title for PowerShell', () => {
    component.interpreter = 'powershell';
    expect(component.title).toBe('Windows PowerShell');
  });

  it('should generate correct prompt for CMD', () => {
    component.interpreter = 'cmd';
    component.path = 'C:\\Users\\test';
    component.promptSymbol = '>';
    expect(component.linePrompt).toBe('C:\\Users\\test>');
  });

  it('should generate correct prompt for PowerShell', () => {
    component.interpreter = 'powershell';
    component.path = 'C:\\Users\\test';
    component.shellPrefix = 'PS ';
    component.promptSymbol = '>';
    expect(component.linePrompt).toBe('PS C:\\Users\\test>');
  });
});
