import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TerminalWindowsStyle {
    content?: { [key: string]: string };
    linePrompt?: { 
        ps?: { [key: string]: string };
        path?: { [key: string]: string };
        promptSymbol?: { [key: string]: string };
    }
}

@Component({
    selector: 'ng-terminal-simulator-windows',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './terminal-windows.html',
    styleUrls: ['./terminal-windows.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalWindows implements OnInit, OnDestroy {
    @ViewChild('contentElement') contentElement!: ElementRef<HTMLDivElement>;

    @Input() textContent: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    @Input() theme: 'light' | 'dark' = 'dark';
    @Input() path: string = 'C:\\Users\\user';
    @Input() interpreter: 'cmd' | 'powershell' = 'cmd';
    @Input() shellPrefix: string = 'PS ';
    @Input() fontSize: number = 18;
    @Input() promptSymbol: string = '>';
    @Input() enableTypingAnimation: boolean = true;
    @Input() terminalStyle: TerminalWindowsStyle = {};
    @Input() minTypingDelay: number = 50;
    @Input() maxTypingDelay: number = 80;
    @Input() pauseBetweenLines: number = 300;
    @Input() initialTypingDelay: number = 1000;
    @Input() cursorBlinkSpeed: number = 500;

    lines: string[] = [];
    currentTypedLines: string[] = [];
    currentLineIndex: number = 0;
    currentCharIndex: number = 0;
    isTyping: boolean = false;
    currentRunId: number = 0;
    windowSize: string = '80x24';

    private resizeObserver?: ResizeObserver;
    private timeouts: number[] = [];

    get title(): string {
        const shell = this.interpreter === 'powershell' ? 'Windows PowerShell' : 'Command Prompt';
        return `${shell}`;
    }

    get linePrompt(): string {
        if (this.interpreter === 'powershell') {
            return `${this.shellPrefix}${this.path}${this.promptSymbol}`;
        }
        return `${this.path}${this.promptSymbol}`;
    }

    ngOnInit(): void {
        this.initializeStyleConfig();
    }

    ngAfterViewInit(): void {
        this.calculateWindowSize();
        this.setupResizeObserver();
        this.lines = this.splitTextIntoLines(this.textContent);
        this.currentTypedLines = new Array(this.lines.length).fill('');
        
        if (this.enableTypingAnimation) {
            const timeoutId = window.setTimeout(() => {
                this.startTyping();
            }, this.initialTypingDelay);
            this.timeouts.push(timeoutId);
        } else {
            this.currentTypedLines = [...this.lines];
        }
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
        this.cancelAllTyping();
    }

    public startTyping(): void {
        this.cancelAllTyping();
        this.currentRunId++;
        this.currentLineIndex = 0;
        this.currentCharIndex = 0;
        this.currentTypedLines = new Array(this.lines.length).fill('');
        this.isTyping = true;
        this.typeNextCharacter(this.currentRunId);
    }

    private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.calculateWindowSize();
        });

        if (this.contentElement?.nativeElement) {
            this.resizeObserver.observe(this.contentElement.nativeElement);
        }
    }

    private calculateWindowSize(): void {
        if (!this.contentElement?.nativeElement) return;

        const element = this.contentElement.nativeElement;
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const charWidth = fontSize * 0.6;
        const lineHeight = fontSize * 1.2;

        const width = element.clientWidth;
        const height = element.clientHeight;

        const cols = Math.floor(width / charWidth);
        const rows = Math.floor(height / lineHeight);

        this.windowSize = `${cols}x${rows}`;
    }

    private splitTextIntoLines(text: string): string[] {
        if (!text) return [];
        
        const element = this.contentElement?.nativeElement;
        if (!element) return text.split('\n');

        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const charWidth = fontSize * 0.6;
        const maxWidth = element.clientWidth - 32;
        const maxCharsPerLine = Math.floor(maxWidth / charWidth);

        const lines: string[] = [];
        const paragraphs = text.split('\n');

        for (const paragraph of paragraphs) {
            if (paragraph.length <= maxCharsPerLine) {
                lines.push(paragraph);
            } else {
                let remaining = paragraph;
                while (remaining.length > 0) {
                    lines.push(remaining.substring(0, maxCharsPerLine));
                    remaining = remaining.substring(maxCharsPerLine);
                }
            }
        }

        return lines;
    }

    private initializeStyleConfig(): void {
        if (!this.terminalStyle.linePrompt) {
            this.terminalStyle.linePrompt = {};
        }
        
        if (!this.terminalStyle.linePrompt.ps) {
            this.terminalStyle.linePrompt.ps = {};
        }
        
        if (!this.terminalStyle.linePrompt.path) {
            this.terminalStyle.linePrompt.path = {};
        }
        
        if (!this.terminalStyle.linePrompt.promptSymbol) {
            this.terminalStyle.linePrompt.promptSymbol = {};
        }

        if (!this.terminalStyle.content) {
            this.terminalStyle.content = {};
        }
    }

    private typeNextCharacter(runId: number): void {
        if (runId !== this.currentRunId) return;

        if (this.currentLineIndex >= this.lines.length) {
            this.isTyping = false;
            return;
        }

        const currentLine = this.lines[this.currentLineIndex];

        if (this.currentCharIndex < currentLine.length) {
            this.currentTypedLines[this.currentLineIndex] += currentLine[this.currentCharIndex];
            this.currentCharIndex++;

            const delay = Math.random() * (this.maxTypingDelay - this.minTypingDelay) + this.minTypingDelay;
            const timeoutId = window.setTimeout(() => this.typeNextCharacter(runId), delay);
            this.timeouts.push(timeoutId);
        } else {
            this.currentLineIndex++;
            this.currentCharIndex = 0;

            if (this.currentLineIndex < this.lines.length) {
                const timeoutId = window.setTimeout(() => this.typeNextCharacter(runId), this.pauseBetweenLines);
                this.timeouts.push(timeoutId);
            } else {
                this.isTyping = false;
            }
        }
    }

    private cancelAllTyping(): void {
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts = [];
        this.isTyping = false;
    }
}
