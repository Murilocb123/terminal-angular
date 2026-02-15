import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTerminalComponent } from '../base-terminal.component';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TextWrapperService } from '../services/text-wrapper.service';
import { TerminalStyleConfig } from '../models/terminal-style';

@Component({
    selector: 'ng-terminal-simulator-windows',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './terminal-windows.html',
    styleUrls: ['./terminal-windows.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TypingAnimationService],
})
export class TerminalWindows extends BaseTerminalComponent {
  @Input() override textContent: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  @Input() override promptSymbol: string = '>';
  @Input() path: string = 'C:\\Users\\user';
  @Input() interpreter: 'cmd' | 'powershell' = 'cmd';
  @Input() shellPrefix: string = 'PS ';

  constructor(
    cdr: ChangeDetectorRef,
    typingAnimationService: TypingAnimationService,
    textWrapperService: TextWrapperService
  ) {
    super(cdr, typingAnimationService, textWrapperService);
  }

  override getTerminalElementId(): string {
    return 'windows-terminal-content';
  }

  override get title(): string {
    const shell = this.interpreter === 'powershell' ? 'Windows PowerShell' : 'Command Prompt';
    return `${shell}`;
  }

  override get linePrompt(): string {
    if (this.interpreter === 'powershell') {
      return `${this.shellPrefix}${this.path}${this.promptSymbol}`;
    }
    return `${this.path}${this.promptSymbol}`;
  }

  override getStyleConfig(): TerminalStyleConfig {
    return this.terminalStyle;
  }
}
