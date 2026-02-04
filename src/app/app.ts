import { Component, signal } from '@angular/core';
import { TerminalMac } from 'ng-terminal-simulator';

@Component({
    selector: 'app-root',
    imports: [TerminalMac],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('terminal-angular');
}
