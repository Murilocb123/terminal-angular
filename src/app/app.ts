import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Terminal } from './components/terminal/terminal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Terminal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('terminal-angular');
}
