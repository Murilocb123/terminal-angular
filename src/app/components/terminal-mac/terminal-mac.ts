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

    linesContent: string[] = [];

    private sizeWindow: string = '80x24';

    private windowResizeObserver?: ResizeObserver;

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
            this.cdr.detectChanges();
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
                    lineContent = w.length > contentCols ? w : w;
                } else {
                    lineContent = w;
                }
            }
            if (lineContent) out.push(lineContent);
        }
        this.linesContent = out;
    }

    private initializeStyle(): void {
        this.terminalStyle.content = this.terminalStyle.content ?? {};
        this.terminalStyle.content!['font-size'] = `${this.fontSize}px`;
    }
}