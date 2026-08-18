import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-layout',
  imports: [CommonModule],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.scss',
  encapsulation: ViewEncapsulation.None
})
export class PageLayout {}
