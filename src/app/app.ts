import { Component, signal } from '@angular/core';
import { TerminalMac } from 'ng-terminal';

@Component({
    selector: 'app-root',
    imports: [TerminalMac],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('terminal-angular');
}
