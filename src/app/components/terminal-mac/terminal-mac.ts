import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, input, Input, OnInit, OnDestroy } from '@angular/core';



export interface TerminalMacStyle {
    content?: { [key: string]: string };
    linePrompt?: { 
        username?: { [key: string]: string };
        hostname?: { [key: string]: string };
        promptSymbol?: { [key: string]: string };
        at?: { [key: string]: string };
        tilde?: { [key: string]: string };
    }
}


@Component({
    selector: 'app-terminal-mac',
    imports: [CommonModule],
    templateUrl: './terminal-mac.html',
    styleUrl: './terminal-mac.scss',
})
export class TerminalMac implements OnInit, AfterViewInit, OnDestroy {
    @Input() textContent: string =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    @Input() theme: 'light' | 'dark' = 'dark';
    @Input() username: string = 'user';
    @Input() at: string = '@';
    @Input() hostname: string = 'macbook-pro';
    @Input() tilde: string = ' ~ ';
    @Input() interpreter: string = 'zsh';
    @Input() fontSize: number = 18;
    @Input() promptSymbol: string = '% ';
    @Input() enableAnimations: boolean = true;
    @Input() terminalStyle: TerminalMacStyle = {};

    @Input() typingMinMs: number = 50;
    @Input() typingMaxMs: number = 80;
    @Input() linePauseMs: number = 300;
    @Input() initialDelayMs: number = 1000;
    @Input() cursorBlinkMs: number = 500;

    linesContent: string[] = [];
    typedLines: string[] = [];
    activeLineIndex: number = 0;
    activeCharIndex: number = 0;
    isTyping: boolean = false;
    typingRunId: number = 0;

    private sizeWindow: string = '80x24';

    private windowResizeObserver?: ResizeObserver;

    private typingTimeouts: Array<ReturnType<typeof setTimeout>> = [];

    constructor(private cdr: ChangeDetectorRef) {}

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
        this.typingTimeouts.forEach(clearTimeout);
    }

    get title(): string {
        return `${this.username} — ${this.interpreter} — ${this.sizeWindow}`;
    }

    get linePrompt(): string {
        return `${this.username}${this.at}${this.hostname}${this.tilde}${this.promptSymbol}`;
    }



    private initializeResizeObserver(): void {
        this.windowResizeObserver = new ResizeObserver(() => {
            this.calculateSizeWindow();
            this.splitTextContent();
        });
        const macTerminalElement = document.getElementById('mac-terminal-content');
        if (macTerminalElement) {
            this.windowResizeObserver.observe(macTerminalElement);
        }
    }

    private calculateSizeWindow(): void {
        const macTerminalElement = document.getElementById('mac-terminal-content');
        if (macTerminalElement) {
            const width = macTerminalElement.offsetWidth;
            const height = macTerminalElement.offsetHeight;
            const cols = Math.floor(width / (this.fontSize * 0.6));
            const rows = Math.floor(height / (this.fontSize * 1.2));
            this.sizeWindow = `${cols}x${rows}`;
        }
    }

    private splitTextContent(): void {
        const macTerminalElement = document.getElementById('mac-terminal-content');
        if (!macTerminalElement) return;
        const cols = Math.floor(macTerminalElement.offsetWidth / (this.fontSize * 0.6));
        const linePrompt = this.linePrompt;
        const promptLength = linePrompt.length;
        const contentCols = Math.max(1, cols - promptLength);
        const paragraphs = this.textContent.split(/\r?\n/);
        const out: string[] = [];

        for (const p of paragraphs) {
            const words = p.trim().split(/\s+/).filter(Boolean);
            let lineContent = '';
            for (const w of words) {
                const candidate = lineContent ? `${lineContent} ${w}` : w;
                if (candidate.length > contentCols) {
                    if (lineContent) {
                        out.push(lineContent);
                    }
                    if (w.length > contentCols) {
                        let remaining = w;
                        while (remaining.length > contentCols) {
                            out.push(remaining.slice(0, contentCols));
                            remaining = remaining.slice(contentCols);
                        }
                        lineContent = remaining;
                    } else {
                        lineContent = w;
                    }
                } else {
                    lineContent = candidate;
                }
            }
            if (lineContent) out.push(lineContent);
        }
        this.linesContent = out;
        if (this.enableAnimations) {
            this.startTyping();
        } else {
            this.stopTyping();
            this.typedLines = [...this.linesContent];
            this.activeLineIndex = this.linesContent.length > 0 ? this.linesContent.length - 1 : 0;
        }
    }

    private initializeStyle(): void {
        this.terminalStyle.content = this.terminalStyle.content ?? {};
        this.terminalStyle.content!['font-size'] = `${this.fontSize}px`;
    }

    startTyping(): void {
        if (!this.linesContent.length) return;
        if (!this.enableAnimations) {
            this.stopTyping();
            this.typedLines = [...this.linesContent];
            this.activeLineIndex = this.linesContent.length - 1;
            return;
        }
        this.stopTyping();
        this.isTyping = true;
        this.activeLineIndex = 0;
        this.activeCharIndex = 0;
        this.typedLines = this.linesContent.map(() => '');
        const runId = ++this.typingRunId;
        this.typingTimeouts.push(setTimeout(() => this.typeNextChar(runId), this.initialDelayMs));
    }

    private typeNextChar(runId: number): void {
        if (runId !== this.typingRunId) return;
        if (this.activeLineIndex >= this.linesContent.length) {
            this.isTyping = false;
            this.cdr.detectChanges();
            return;
        }
        const line = this.linesContent[this.activeLineIndex];
        if (this.activeCharIndex < line.length) {
            const delay = Math.floor(Math.random() * (this.typingMaxMs - this.typingMinMs + 1)) + this.typingMinMs;
            this.typingTimeouts.push(setTimeout(() => {
                if (runId !== this.typingRunId) return;
                this.typedLines[this.activeLineIndex] = (this.typedLines[this.activeLineIndex] || '') + line[this.activeCharIndex];
                this.activeCharIndex++;
                this.cdr.markForCheck();
                this.typeNextChar(runId);
            }, delay));
        } else {
            this.activeLineIndex++;
            this.activeCharIndex = 0;
            this.typingTimeouts.push(setTimeout(() => this.typeNextChar(runId), this.linePauseMs));
        }
    }

    private stopTyping(): void {
        this.typingRunId++;
        this.isTyping = false;
        this.typingTimeouts.forEach(clearTimeout);
        this.typingTimeouts = [];
    }
}