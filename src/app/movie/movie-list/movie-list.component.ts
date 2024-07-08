import { Component, input, output } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [],
  template: `
    @for (movie of movies(); track movie.id) {
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
          [class.is-favorite]="favoriteMovieIds().has(movie.id)"
          (click)="favoriteToggled.emit(movie)">
          @if (favoriteMovieIds().has(movie.id)) {
            I like it
          } @else {
            Please like me
          }
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 35rem));
      gap: 4rem 2rem;
      place-content: space-between space-evenly;
      align-items: start;
      position: relative;
    }
  `,
})
export class MovieListComponent {
  movies = input.required<MovieModel[]>();
  favoriteMovieIds = input<Set<string>>(new Set<string>([]));

  favoriteToggled = output<MovieModel>();
}
