import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { BaseTerminalComponent } from '../base-terminal.component';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TextWrapperService } from '../services/text-wrapper.service';
import { TerminalStyleConfig } from '../models/terminal-style';

/**
 * TerminalMac Component
 * Renders a macOS-style terminal simulator with typing animation
 * Extends BaseTerminalComponent to inherit shared logic and implement Mac-specific behavior
 */
@Component({
  selector: 'ng-terminal-simulator-mac',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-mac.html',
  styleUrl: './terminal-mac.scss',
  providers: [TypingAnimationService],
})
export class TerminalMac extends BaseTerminalComponent {
  @Input() username: string = 'user';
  @Input() at: string = '@';
  @Input() hostname: string = 'macbook-pro';
  @Input() tilde: string = ' ~ ';
  @Input() interpreter: string = 'zsh';

  constructor(
    cdr: ChangeDetectorRef,
    typingAnimationService: TypingAnimationService,
    textWrapperService: TextWrapperService
  ) {
    super(cdr, typingAnimationService, textWrapperService);
  }

  override getTerminalElementId(): string {
    return 'mac-terminal-content';
  }

  override get linePrompt(): string {
    return `${this.username}${this.at}${this.hostname}${this.tilde}${this.promptSymbol}`;
  }

  override get title(): string {
    return `${this.username} — ${this.interpreter} — ${this.sizeWindow}`;
  }

  override getStyleConfig(): TerminalStyleConfig {
    return this.terminalStyle;
  }
}