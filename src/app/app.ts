import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TerminalMac } from './components/terminal-mac/terminal-mac';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TerminalMac],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('terminal-angular');
}
