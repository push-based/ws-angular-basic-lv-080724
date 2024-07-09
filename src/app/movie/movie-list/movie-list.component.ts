import { Component, input, output } from '@angular/core';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    @for (movie of movies(); track movie.id) {
      <movie-card
        [favorite]="favoriteMovieIds().has(movie.id)"
        (favoriteChange)="favoriteToggled.emit(movie)"
        [movie]="movie" />
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
  movies = input.required<TMDBMovieModel[]>();
  favoriteMovieIds = input<Set<string>>(new Set<string>([]));

  favoriteToggled = output<TMDBMovieModel>();
}
