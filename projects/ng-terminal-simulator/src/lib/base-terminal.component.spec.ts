import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BaseTerminalComponent } from './base-terminal.component';
import { TypingAnimationService } from './services/typing-animation.service';
import { TextWrapperService } from './services/text-wrapper.service';
import { TerminalStyleConfig } from './models/terminal-style';

// Mock ResizeObserver for test environment
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  (window as any).ResizeObserver = class ResizeObserver {
    constructor(_callback: ResizeObserverCallback) {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

@Component({
  selector: 'lib-test-terminal',
  template: '<div id="test-terminal-content"></div>',
  standalone: true,
})
class TestTerminalComponent extends BaseTerminalComponent {
  override getTerminalElementId(): string {
    return 'test-terminal-content';
  }

  override get linePrompt(): string {
    return '$ ';
  }

  override get title(): string {
    return 'Test Terminal';
  }

  override getStyleConfig(): TerminalStyleConfig {
    return {};
  }
}

describe('BaseTerminalComponent', () => {
  let component: TestTerminalComponent;
  let fixture: ComponentFixture<TestTerminalComponent>;
  let mockTypingAnimationService: TypingAnimationService;
  let mockTextWrapperService: TextWrapperService;

  beforeEach(async () => {
    mockTypingAnimationService = {
      startTyping: vi.fn().mockReturnValue(1),
      stopTyping: vi.fn(),
      clearTimeouts: vi.fn(),
    } as any;
    mockTextWrapperService = {
      splitText: vi.fn().mockReturnValue(['test']),
      calculateDimensions: vi.fn().mockReturnValue({ cols: 80, rows: 24 }),
      formatDimensions: vi.fn().mockReturnValue('80x24'),
    } as any;

    await TestBed.configureTestingModule({
      imports: [TestTerminalComponent],
      providers: [
        { provide: TypingAnimationService, useValue: mockTypingAnimationService },
        { provide: TextWrapperService, useValue: mockTextWrapperService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTerminalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
  });

  describe('Lifecycle Hooks', () => {
    it('should initialize style on ngOnInit', () => {
      component.fontSize = 16;
      component.ngOnInit();
      expect(component.terminalStyle.content?.['font-size']).toBe('16px');
    });

    it('should create terminalStyle.content if not exists', () => {
      component.terminalStyle = {};
      component.ngOnInit();
      expect(component.terminalStyle.content).toBeDefined();
    });

    it('should set font-size in terminalStyle on init', () => {
      component.fontSize = 20;
      component.ngOnInit();
      expect(component.terminalStyle.content?.['font-size']).toBe('20px');
    });

    it('should setup ResizeObserver on ngAfterViewInit', () => {
      fixture.detectChanges();
      expect((component as any).windowResizeObserver).toBeDefined();
    });

    it('should calculate window size on ngAfterViewInit', () => {
      fixture.detectChanges();
      expect(mockTextWrapperService.formatDimensions).toHaveBeenCalled();
    });

    it('should split text content on ngAfterViewInit', () => {
      fixture.detectChanges();
      expect(mockTextWrapperService.splitText).toHaveBeenCalled();
    });

    it('should disconnect ResizeObserver on ngOnDestroy', () => {
      fixture.detectChanges();
      const disconnectSpy = vi.spyOn((component as any).windowResizeObserver!, 'disconnect');

      component.ngOnDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should clear timeouts on ngOnDestroy', () => {
      fixture.detectChanges();
      component.ngOnDestroy();
      expect(mockTypingAnimationService.clearTimeouts).toHaveBeenCalled();
    });
  });

  describe('initializeStyle', () => {
    it('should initialize content object if missing', () => {
      component.terminalStyle = {};
      (component as any).initializeStyle();
      expect(component.terminalStyle.content).toBeDefined();
    });

    it('should set font size from input', () => {
      component.fontSize = 24;
      (component as any).initializeStyle();
      expect(component.terminalStyle.content?.['font-size']).toBe('24px');
    });

    it('should override existing font-size', () => {
      component.fontSize = 16;
      component.terminalStyle = { content: { 'font-size': '12px' } };
      (component as any).initializeStyle();
      expect(component.terminalStyle.content?.['font-size']).toBe('16px');
    });
  });

  describe('calculateSizeWindow', () => {
    it('should set sizeWindow from formatDimensions', () => {
      (component as any).calculateSizeWindow();
      expect((component as any).sizeWindow).toBe('80x24');
    });

    it('should handle missing element', () => {
      (component as any).calculateSizeWindow();
      // Should not throw
      expect((component as any).sizeWindow).toBeDefined();
    });
  });

  describe('splitTextContent', () => {
    it('should set linesContent from splitText', () => {
      (component as any).splitTextContent();
      expect(mockTextWrapperService.splitText).toHaveBeenCalled();
    });

    it('should start typing when animations enabled', () => {
      component.enableAnimations = true;
      (component as any).splitTextContent();
      expect(mockTypingAnimationService.startTyping).toHaveBeenCalled();
    });

    it('should copy lines to typedLines when animations disabled', () => {
      component.enableAnimations = false;
      (component as any).splitTextContent();
      expect(component.typedLines).toEqual(['test']);
    });

    it('should set activeLineIndex when animations disabled', () => {
      component.enableAnimations = false;
      (component as any).splitTextContent();
      expect(component.activeLineIndex).toBe(0);
    });

    it('should handle empty lines array', () => {
      component.enableAnimations = false;
      component.linesContent = [];
      (component as any).splitTextContent();
      expect(component.activeLineIndex).toBe(0);
    });

    it('should handle missing element gracefully', () => {
      // Element doesn't exist, should return early
      (component as any).splitTextContent();
      expect(component.linesContent).toBeDefined();
    });
  });

  describe('startTyping', () => {
    it('should call typingAnimationService.startTyping', () => {
      component.linesContent = ['test'];
      component.enableAnimations = true;

      (component as any).startTyping();
      expect(mockTypingAnimationService.startTyping).toHaveBeenCalled();
    });

    it('should set isTyping to true', () => {
      component.linesContent = ['test'];

      (component as any).startTyping();
      expect(component.isTyping).toBe(true);
    });

    it('should set activeLineIndex to 0', () => {
      component.linesContent = ['test'];

      (component as any).startTyping();
      expect(component.activeLineIndex).toBe(0);
    });

    it('should handle empty lines', () => {
      component.linesContent = [];
      (component as any).startTyping();
      expect(component.isTyping).toBe(false);
    });
  });

  describe('stopTyping', () => {
    it('should call typingAnimationService.stopTyping', () => {
      (component as any).stopTyping();
      expect(mockTypingAnimationService.stopTyping).toHaveBeenCalled();
    });

    it('should set isTyping to false', () => {
      (component as any).stopTyping();
      expect(component.isTyping).toBe(false);
    });
  });

  describe('initializeResizeObserver', () => {
    it('should create ResizeObserver', () => {
      (component as any).initializeResizeObserver();
      expect((component as any).windowResizeObserver).toBeDefined();
    });
  });

  describe('buildAnimationConfig', () => {
    it('should create config from inputs', () => {
      component.enableAnimations = true;
      component.typingMinMs = 30;
      component.typingMaxMs = 60;
      component.linePauseMs = 200;
      component.initialDelayMs = 500;
      component.cursorBlinkMs = 400;

      const config = (component as any).buildAnimationConfig();
      expect(config.enableAnimations).toBe(true);
      expect(config.typingMinMs).toBe(30);
      expect(config.typingMaxMs).toBe(60);
      expect(config.linePauseMs).toBe(200);
      expect(config.initialDelayMs).toBe(500);
      expect(config.cursorBlinkMs).toBe(400);
    });
  });

  describe('Input Properties', () => {
    it('should have default textContent', () => {
      expect(component.textContent.length).toBeGreaterThan(0);
    });

    it('should have default theme as dark', () => {
      expect(component.theme).toBe('dark');
    });

    it('should have default fontSize', () => {
      expect(component.fontSize).toBe(18);
    });

    it('should have default promptSymbol', () => {
      expect(component.promptSymbol.length).toBeGreaterThan(0);
    });

    it('should have default enableAnimations as true', () => {
      expect(component.enableAnimations).toBe(true);
    });

    it('should allow changing inputs', () => {
      component.fontSize = 24;
      component.theme = 'light';
      expect(component.fontSize).toBe(24);
      expect(component.theme).toBe('light');
    });
  });

  describe('Abstract Methods', () => {
    it('should have getTerminalElementId implementation', () => {
      expect(component.getTerminalElementId()).toBe('test-terminal-content');
    });

    it('should have linePrompt getter implementation', () => {
      expect(component.linePrompt).toBe('$ ');
    });

    it('should have title getter implementation', () => {
      expect(component.title).toBe('Test Terminal');
    });

    it('should have getStyleConfig implementation', () => {
      expect(component.getStyleConfig()).toBeDefined();
    });
  });
});
