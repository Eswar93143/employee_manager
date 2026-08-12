import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageTest } from './image-test/image-test';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageTest],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-end-test');
}
