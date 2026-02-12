import { Component, signal } from '@angular/core';
import { TerminalMac, TerminalWindows } from 'ng-terminal-simulator';

@Component({
    selector: 'app-root',
    imports: [TerminalMac, TerminalWindows],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('terminal-angular');
}
