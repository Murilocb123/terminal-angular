import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TypingAnimationService } from './typing-animation.service';
import { ChangeDetectorRef } from '@angular/core';

describe('TypingAnimationService', () => {
  let service: TypingAnimationService;
  let mockCdr: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypingAnimationService],
    });
    service = TestBed.inject(TypingAnimationService);
    mockCdr = {
      markForCheck: vi.fn(),
      detectChanges: vi.fn(),
    };
  });

  afterEach(() => {
    service.clearTimeouts();
    vi.useRealTimers
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startTyping', () => {
    it('should return runId', () => {
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      const runId = service.startTyping(lines, typedLines, config, mockCdr);
      expect(runId).toBeGreaterThan(0);
    });

    it('should handle empty lines array', () => {
      const lines: string[] = [];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      const runId = service.startTyping(lines, typedLines, config, mockCdr);
      expect(typedLines.length).toBe(0);
      expect(runId).toBe(0);
    });

    it('should handle animations disabled', () => {
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: false,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      expect(typedLines).toEqual(['test']);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should call onComplete callback when animations disabled', () => {
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: false,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };
      const onComplete = vi.fn();

      service.startTyping(lines, typedLines, config, mockCdr, onComplete);
      expect(onComplete).toHaveBeenCalled();
    });

    it('should initialize typedLines to empty strings', () => {
      vi.useFakeTimers();
      const lines = ['line1', 'line2'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      expect(typedLines).toEqual(['', '']);
      vi.useRealTimers();
    });

    it('should call onProgress callback with initial position', () => {
      vi.useFakeTimers();
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };
      const onProgress = vi.fn();

      service.startTyping(lines, typedLines, config, mockCdr, undefined, onProgress);
      expect(onProgress).toHaveBeenCalledWith(0, 0);
      vi.useRealTimers();
    });
  });

  describe('stopTyping', () => {
    it('should clear all timeouts', () => {
      vi.useFakeTimers();
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      service.stopTyping();
      vi.advanceTimersByTime(1000);
      expect(typedLines).toEqual(['']);
      vi.useRealTimers();
    });

    it('should increment typingRunId', () => {
      const initialRunId = (service as any).typingRunId;
      service.stopTyping();
      expect((service as any).typingRunId).toBe(initialRunId + 1);
    });
  });

  describe('clearTimeouts', () => {
    it('should clear all scheduled timeouts', () => {
      vi.useFakeTimers();
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 20,
        linePauseMs: 30,
        initialDelayMs: 40,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      service.clearTimeouts();
      vi.advanceTimersByTime(1000);
      expect(typedLines).toEqual(['']);
      vi.useRealTimers();
    });
  });

  describe('typing animation flow', () => {
    it('should type characters one by one with delays', () => {
      vi.useFakeTimers();
      const lines = ['hi'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 10,
        linePauseMs: 30,
        initialDelayMs: 0,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      vi.advanceTimersByTime(50); // Enough time to type both characters
      
      expect(typedLines[0]).toBe('hi');
      vi.useRealTimers();
    });

    it('should call onComplete when finished typing', () => {
      vi.useFakeTimers();
      const lines = ['a'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 10,
        linePauseMs: 30,
        initialDelayMs: 0,
        cursorBlinkMs: 500,
      };
      const onComplete = vi.fn();

      service.startTyping(lines, typedLines, config, mockCdr, onComplete);
      vi.advanceTimersByTime(100);

      expect(onComplete).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('should track progress with onProgress callback', () => {
      vi.useFakeTimers();
      const lines = ['ab'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 10,
        linePauseMs: 30,
        initialDelayMs: 0,
        cursorBlinkMs: 500,
      };
      const onProgress = vi.fn();

      service.startTyping(lines, typedLines, config, mockCdr, undefined, onProgress);
      vi.advanceTimersByTime(50);

      expect(onProgress).toHaveBeenCalledWith(0, 1);
      vi.useRealTimers();
    });

    it('should handle multiple lines with pause between', () => {
      vi.useFakeTimers();
      const lines = ['a', 'b'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 10,
        linePauseMs: 30,
        initialDelayMs: 0,
        cursorBlinkMs: 500,
      };

      service.startTyping(lines, typedLines, config, mockCdr);
      vi.advanceTimersByTime(100);

      expect(typedLines).toEqual(['a', 'b']);
      vi.useRealTimers();
    });

    it('should stop if runId becomes invalid', () => {
      vi.useFakeTimers();
      const lines = ['test'];
      const typedLines: string[] = [];
      const config = {
        enableAnimations: true,
        typingMinMs: 10,
        typingMaxMs: 10,
        linePauseMs: 30,
        initialDelayMs: 0,
        cursorBlinkMs: 500,
      };

      const runId = service.startTyping(lines, typedLines, config, mockCdr);
      service.stopTyping(); // This increments runId
      vi.advanceTimersByTime(100);

      // The typing should stop because runId is invalid
      expect(typedLines[0]?.length || 0).toBeLessThan(4);
      vi.useRealTimers();
    });
  });
});
