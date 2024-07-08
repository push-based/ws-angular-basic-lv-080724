import { Component } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>
      <div class="movie-card">
        <img
          class="movie-image"
          [alt]="movie.title"
          [src]="'https://image.tmdb.org/t/p/w342' + movie.poster_path" />
        <div class="movie-card-content">
          <div class="movie-card-title">{{ movie.title }}</div>
          <div class="movie-card-rating">{{ movie.vote_average }}</div>
        </div>
        <button
          class="favorite-indicator"
          [class.is-favorite]="isFavorite"
          (click)="toggleFavorite(movie)">
          @if (isFavorite) {
            I like it
          } @else {
            Please like me
          }
        </button>
      </div>
    </app-shell>
  `,
})
export class AppComponent {
  movie = {
    id: 'the-god',
    title: 'The Godfather',
    vote_average: 10,
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  };

  isFavorite = false;

  toggleFavorite(movie) {
    this.isFavorite = !this.isFavorite;
    console.log('toggled', movie);
  }
}
