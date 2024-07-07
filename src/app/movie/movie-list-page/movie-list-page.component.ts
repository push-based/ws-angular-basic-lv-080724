import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { MovieModel, TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TMDB_CATEGORIES } from '../tmdb-categories';

@Component({
  selector: 'movie-list-page',
  standalone: true,
  imports: [MovieListComponent],
  template: `
    <div class="favorite-widget">
      @for (fav of favoriteMovies(); track fav; let last = $last) {
        <span>{{ fav.title }}</span>
        @if (!last) {
          <span>•</span>
        }
      }
    </div>
    @if (loading()) {
      <div class="loader"></div>
    } @else {
      <movie-list
        [movies]="movies()"
        [favoriteMovieIds]="favoriteMovieIds()"
        (toggleFavorite)="toggleFavorite($event)">
        <div class="movie-list-header">
          <h1>{{ header().heading }}</h1>
          <h2>{{ header().subheading }}</h2>
        </div>
      </movie-list>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListPageComponent {
  movies = signal<TMDBMovieModel[] | null>(null);

  routeParams = signal<Params>({});

  availableCategories = inject(TMDB_CATEGORIES);

  header = computed(() => {
    const params = this.routeParams();
    if (params.query) {
      return {
        heading: 'Search',
        subheading: params.query,
      };
    } else if (params.category) {
      return {
        heading: this.availableCategories.find(
          category => category.id === params.category
        ).label,
        subheading: 'Category',
      };
    }
    return {
      heading: 'Genre',
      subheading: '',
    };
  });

  loading = computed(() => !this.movies());

  favoriteMovieIds = signal(new Set<string>(), {
    equal: () => false,
  });

  favoriteMovies = computed(() =>
    (this.movies() ?? []).filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe(params => {
      this.movies.set(null);
      this.routeParams.set(params);
      if (params.query) {
        this.movieService.searchMovies(params.query).subscribe(data => {
          this.movies.set(data.results);
        });
      } else if (params.genreId) {
        this.movieService.getMoviesByGenre(params.genreId).subscribe(data => {
          this.movies.set(data.results);
        });
      } else {
        this.movieService.getMovies(params.category).subscribe(data => {
          this.movies.set(data.results);
        });
      }
    });
  }

  toggleFavorite(movie: MovieModel) {
    this.favoriteMovieIds.update(favoriteMovieIds => {
      if (favoriteMovieIds.has(movie.id)) {
        favoriteMovieIds.delete(movie.id);
      } else {
        favoriteMovieIds.add(movie.id);
      }
      return favoriteMovieIds;
    });
  }
}
