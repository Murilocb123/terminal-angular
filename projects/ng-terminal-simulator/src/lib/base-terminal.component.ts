import {
  Directive,
  Input,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { TypingAnimationService } from './services/typing-animation.service';
import { TextWrapperService, TextWrapperConfig } from './services/text-wrapper.service';
import { TerminalStyleConfig, TerminalTheme } from './models/terminal-style';
import { AnimationConfig, DEFAULT_ANIMATION_CONFIG } from './models/animation-config';

/**
 * Abstract base class for terminal components
 * Implements shared functionality following SOLID principles:
 * - Single Responsibility: Manages terminal state and lifecycle
 * - Open/Closed: Extensible through abstract methods
 * - Liskov Substitution: Subclasses can replace without breaking contracts
 * - Interface Segregation: Platform-specific methods isolated
 * - Dependency Inversion: Depends on services, not implementation details
 *
 * Consolidates ~85 lines of duplicated code from Mac and Windows components
 */
@Directive()
export abstract class BaseTerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  // ============================================
  // Shared Inputs
  // ============================================
  @Input() textContent: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  @Input() theme: TerminalTheme = 'dark';
  @Input() fontSize: number = 18;
  @Input() promptSymbol: string = '% ';
  @Input() enableAnimations: boolean = true;
  @Input() terminalStyle: TerminalStyleConfig = {};

  // Animation configuration inputs (backward compatible with individual inputs)
  @Input() typingMinMs: number = 50;
  @Input() typingMaxMs: number = 80;
  @Input() linePauseMs: number = 300;
  @Input() initialDelayMs: number = 1000;
  @Input() cursorBlinkMs: number = 500;

  // ============================================
  // Shared State
  // ============================================
  linesContent: string[] = [];
  typedLines: string[] = [];
  activeLineIndex: number = 0;
  activeCharIndex: number = 0;
  isTyping: boolean = false;
  typingRunId: number = 0;

  protected sizeWindow: string = '80x24';
  protected windowResizeObserver?: ResizeObserver;

  // ============================================
  // Constructor & Dependency Injection
  // ============================================
  constructor(
    protected cdr: ChangeDetectorRef,
    protected typingAnimationService: TypingAnimationService,
    protected textWrapperService: TextWrapperService
  ) {}

  // ============================================
  // Abstract Methods (Platform-Specific)
  // ============================================

  /**
   * Returns the terminal element ID specific to this platform
   * Mac components return 'mac-terminal-content', Windows return 'windows-terminal-content'
   */
  abstract getTerminalElementId(): string;

  /**
   * Returns formatted prompt string for display
   * Mac: "user@hostname ~ % "
   * Windows: "PS C:\Users\user>" or "C:\Users\user>"
   */
  abstract get linePrompt(): string;

  /**
   * Returns title string for window header
   * Mac: "user — zsh — 80x24"
   * Windows: "Windows PowerShell" or "Command Prompt"
   */
  abstract get title(): string;

  /**
   * Returns platform-specific style configuration
   */
  abstract getStyleConfig(): TerminalStyleConfig;

  /**
   * Returns text wrapper configuration if platform-specific metrics needed
   */
  protected getTextWrapperConfig(): Partial<TextWrapperConfig> {
    return {};
  }

  // ============================================
  // Lifecycle Hooks (Final Implementation)
  // ============================================

  ngOnInit(): void {
    this.initializeStyle();
  }

  ngAfterViewInit(): void {
    this.calculateSizeWindow();
    this.splitTextContent();
    this.initializeResizeObserver();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.windowResizeObserver?.disconnect();
    this.typingAnimationService.clearTimeouts();
  }

  // ============================================
  // Protected Methods (Shared Logic)
  // ============================================

  /**
   * Initializes terminal style with dynamic font size
   */
  protected initializeStyle(): void {
    this.terminalStyle.content = this.terminalStyle.content ?? {};
    this.terminalStyle.content['font-size'] = `${this.fontSize}px`;
  }

  /**
   * Calculates terminal size in "COLSxROWS" format and splits text
   */
  protected calculateSizeWindow(): void {
    const element = document.getElementById(this.getTerminalElementId());
    if (element) {
      this.sizeWindow = this.textWrapperService.formatDimensions(
        element.offsetWidth,
        element.offsetHeight,
        this.fontSize,
        this.getTextWrapperConfig()
      );
    }
  }

  /**
   * Splits text into lines based on terminal width
   * Called on init and resize
   */
  protected splitTextContent(): void {
    const element = document.getElementById(this.getTerminalElementId());
    if (!element) return;

    const promptLength = this.linePrompt.length;
    this.linesContent = this.textWrapperService.splitText(
      this.textContent,
      element.offsetWidth,
      this.fontSize,
      promptLength,
      this.getTextWrapperConfig()
    );

    if (this.enableAnimations) {
      this.startTyping();
    } else {
      this.stopTyping();
      this.typedLines = [...this.linesContent];
      this.activeLineIndex = this.linesContent.length > 0 ? this.linesContent.length - 1 : 0;
    }
  }

  /**
   * Initiates typing animation with current configuration
   */
  protected startTyping(): void {
    if (!this.linesContent.length) {
      this.isTyping = false;
      return;
    }
    const config = this.buildAnimationConfig();
    this.typingRunId = this.typingAnimationService.startTyping(
      this.linesContent,
      this.typedLines,
      config,
      this.cdr,
      () => {
        this.isTyping = false;
        this.cdr.detectChanges();
      },
      (lineIndex, charIndex) => {
        this.activeLineIndex = lineIndex;
        this.activeCharIndex = charIndex;
      }
    );
    this.isTyping = true;
    this.activeLineIndex = 0;
    this.activeCharIndex = 0;
  }

  /**
   * Stops typing animation
   */
  protected stopTyping(): void {
    this.typingAnimationService.stopTyping();
    this.isTyping = false;
  }

  /**
   * Sets up ResizeObserver to recalculate layout on resize
   */
  protected initializeResizeObserver(): void {
    this.windowResizeObserver = new ResizeObserver(() => {
      this.calculateSizeWindow();
      this.splitTextContent();
    });

    const element = document.getElementById(this.getTerminalElementId());
    if (element) {
      this.windowResizeObserver.observe(element);
    }
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  /**
   * Builds AnimationConfig from individual inputs
   * Maintains backward compatibility with individual @Input properties
   */
  private buildAnimationConfig(): AnimationConfig {
    return {
      enableAnimations: this.enableAnimations,
      typingMinMs: this.typingMinMs,
      typingMaxMs: this.typingMaxMs,
      linePauseMs: this.linePauseMs,
      initialDelayMs: this.initialDelayMs,
      cursorBlinkMs: this.cursorBlinkMs,
    };
  }
}
