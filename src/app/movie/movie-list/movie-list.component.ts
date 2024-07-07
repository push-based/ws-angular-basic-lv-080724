import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { MovieModel } from '../../shared/model/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent, RouterLink, FastSvgComponent],
  template: `
    <div class="movie-list-title">
      <ng-content select=".movie-list-header" />
    </div>
    @if (empty()) {
      <div class="no-movies">
        <fast-svg name="sad" size="50" />
        There are no movies to show
      </div>
    }
    @for (movie of movies(); track movie.id) {
      <movie-card
        [routerLink]="['/movie', movie.id]"
        [movie]="movie"
        [favorite]="favoriteMovieIds().has(movie.id)"
        (favoriteChange)="toggleFavorite.emit(movie)" />
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies = input.required<MovieModel[]>();
  favoriteMovieIds = input(new Set<string>());
  toggleFavorite = output<MovieModel>();

  empty = computed(() => this.movies().length === 0);

  // child = contentChild();
}
