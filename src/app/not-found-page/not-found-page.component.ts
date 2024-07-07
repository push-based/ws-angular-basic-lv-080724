import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'not-found-page',
  standalone: true,
  imports: [FastSvgComponent, RouterLink],
  template: `
    <div class="not-found-container">
      <fast-svg size="350px" name="error"></fast-svg>
      <h1 class="title">Sorry, page not found</h1>

      <a class="btn" routerLink="/list/popular">See popular</a>
    </div>
  `,
  styles: ``,
})
export class NotFoundPageComponent {}
