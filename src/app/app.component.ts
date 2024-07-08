import { Component } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';
import { MovieModel } from './shared/model/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>
      <div class="favorite-widget">
        @for (fav of favoriteMovies(); track fav.id) {
          <span>{{ fav.title }}</span>

          @if (!$last) {
            <span>•</span>
          }
        }
      </div>

      @for (movie of movies; track movie.id) {
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
            [class.is-favorite]="favoriteMovieIds.has(movie.id)"
            (click)="toggleFavorite(movie)">
            @if (favoriteMovieIds.has(movie.id)) {
              I like it
            } @else {
              Please like me
            }
          </button>
        </div>
      }
    </app-shell>
  `,
})
export class AppComponent {
  movies: MovieModel[] = [
    {
      id: 'the-god',
      title: 'The Godfather',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      vote_average: 10,
    },
    {
      id: 'the-god-2',
      title: 'The Godfather part II',
      poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
      vote_average: 9,
    },
    {
      id: 'the-god-3',
      title: 'The Godfather part III',
      poster_path: '/lm3pQ2QoQ16pextRsmnUbG2onES.jpg',
      vote_average: 10,
    },
  ];

  favoriteMovies = (): MovieModel[] => {
    return this.movies.filter(movie => this.favoriteMovieIds.has(movie.id));
  };

  favoriteMovieIds = new Set<string>();

  toggleFavorite(movie: MovieModel) {
    console.log('toggled', movie);
    if (this.favoriteMovieIds.has(movie.id)) {
      this.favoriteMovieIds.delete(movie.id);
    } else {
      this.favoriteMovieIds.add(movie.id);
    }
  }
}
