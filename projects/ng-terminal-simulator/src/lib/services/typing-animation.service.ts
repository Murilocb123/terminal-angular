import { Injectable, ChangeDetectorRef } from '@angular/core';
import { AnimationConfig } from '../models/animation-config';

/**
 * Service responsible for managing typing animation logic
 * Handles character-by-character typing with configurable delays
 * Follows Single Responsibility Principle - animation logic only
 */
@Injectable()
export class TypingAnimationService {
  private typingTimeouts: Array<ReturnType<typeof setTimeout>> = [];
  private typingRunId: number = 0;

  constructor() {}

  /**
   * Initiates typing animation for multiple lines of text
   * @param lines - Array of text lines to type
   * @param typedLines - Array to accumulate typed characters (modified in place)
   * @param config - Animation configuration
   * @param cdr - Change detector reference for manual change detection
   * @param onComplete - Optional callback when animation finishes
   */
  startTyping(
    lines: string[],
    typedLines: string[],
    config: AnimationConfig,
    cdr: ChangeDetectorRef,
    onComplete?: () => void,
    onProgress?: (lineIndex: number, charIndex: number) => void
  ): number {
    if (!lines.length || !config.enableAnimations) {
      typedLines.splice(0, typedLines.length, ...lines);
      cdr.markForCheck();
      onComplete?.();
      return this.typingRunId;
    }

    this.stopTyping();
    const runId = ++this.typingRunId;

    typedLines.splice(0, typedLines.length, ...lines.map(() => ''));
    onProgress?.(0, 0);

    this.typingTimeouts.push(
      setTimeout(
        () =>
          this.typeNextChar(
            lines,
            typedLines,
            config,
            cdr,
            0,
            0,
            runId,
            onComplete,
            onProgress
          ),
        config.initialDelayMs
      )
    );

    return runId;
  }

  /**
   * Stops all ongoing typing animations and clears timeouts
   */
  stopTyping(): void {
    this.typingRunId++;
    this.typingTimeouts.forEach(clearTimeout);
    this.typingTimeouts = [];
  }

  /**
   * Clears all scheduled timeouts (for cleanup)
   */
  clearTimeouts(): void {
    this.typingTimeouts.forEach(clearTimeout);
    this.typingTimeouts = [];
  }

  /**
   * Recursive function that types one character at a time
   * Maintains state about current line and character position
   */
  private typeNextChar(
    lines: string[],
    typedLines: string[],
    config: AnimationConfig,
    cdr: ChangeDetectorRef,
    lineIndex: number,
    charIndex: number,
    runId: number,
    onComplete?: () => void,
    onProgress?: (lineIndex: number, charIndex: number) => void
  ): void {
    // Check if this animation run is still active
    if (runId !== this.typingRunId) return;

    // Animation complete - all lines typed
    if (lineIndex >= lines.length) {
      cdr.detectChanges();
      onComplete?.();
      return;
    }

    const line = lines[lineIndex];

    // Type next character in current line
    if (charIndex < line.length) {
      const delay = Math.floor(
        Math.random() * (config.typingMaxMs - config.typingMinMs + 1) + config.typingMinMs
      );

      this.typingTimeouts.push(
        setTimeout(() => {
          if (runId !== this.typingRunId) return; 

          typedLines[lineIndex] = (typedLines[lineIndex] || '') + line[charIndex];
          onProgress?.(lineIndex, charIndex + 1);
          cdr.markForCheck();

          this.typeNextChar(
            lines,
            typedLines,
            config,
            cdr,
            lineIndex,
            charIndex + 1,
            runId,
            onComplete,
            onProgress
          );
        }, delay)
      );
    } else {
      // Line complete - move to next line
      this.typingTimeouts.push(
        setTimeout(
          () =>
            this.typeNextChar(
              lines,
              typedLines,
              config,
              cdr,
              lineIndex + 1,
              0,
              runId,
              onComplete,
              onProgress
            ),
          config.linePauseMs
        )
      );
    }
  }
}
