import { Component, computed, inject, signal } from '@angular/core';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'movie-list-page',
  standalone: true,
  imports: [MovieListComponent],
  template: `
    <div class="favorite-widget">
      @for (fav of favoriteMovies(); track fav.id) {
        <span (click)="toggleFavorite(fav)">{{ fav.title }}</span>

        @if (!$last) {
          <span>•</span>
        }
      }
    </div>

    @if (loading()) {
      <div class="loader"></div>
    } @else {
      <movie-list
        (favoriteToggled)="toggleFavorite($event)"
        [favoriteMovieIds]="favoriteMovieIds()"
        [movies]="movies()" />
    }
  `,
  styles: ``,
})
export class MovieListPageComponent {
  movies = signal<TMDBMovieModel[]>([]);

  loading = computed(() => this.movies().length === 0);

  favoriteMovieIds = signal(new Set<string>());

  // depends on movies() & favoriteMovieIds()
  favoriteMovies = computed<TMDBMovieModel[]>(() =>
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);

  constructor() {
    this.movieService.getMovies('top_rated').subscribe(response => {
      setTimeout(() => {
        this.movies.set(response.results);
      }, 1500);
    });
  }

  toggleFavorite(movie: TMDBMovieModel) {
    this.favoriteMovieIds.update(oldSet => {
      if (oldSet.has(movie.id)) {
        oldSet.delete(movie.id);
      } else {
        oldSet.add(movie.id);
      }
      return new Set<string>(oldSet);
    });
  }
}
