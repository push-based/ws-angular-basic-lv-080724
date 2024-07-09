import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  movies = signal<TMDBMovieModel[] | null>(null);

  loading = computed(() => !this.movies());

  favoriteMovieIds = signal(new Set<string>());

  // depends on movies() & favoriteMovieIds()
  favoriteMovies = computed<TMDBMovieModel[]>(() =>
    (this.movies() ?? []).filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      // we got a new parameter here, we will start fetching new movies

      this.movies.set(null);

      if (params.term) {
        this.movieService.searchMovies(params.term).subscribe(response => {
          setTimeout(() => {
            this.movies.set(response.results);
          }, 1500);
        });
      } else {
        this.movieService.getMovies(params.category).subscribe(response => {
          setTimeout(() => {
            this.movies.set(response.results);
          }, 1500);
        });
      }
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
