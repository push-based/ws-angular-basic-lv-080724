import { HttpClient } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';

import { environment } from '../environments/environment';
import { AppShellComponent } from './app-shell/app-shell.component';
import { MovieListComponent } from './movie/movie-list/movie-list.component';
import { TMDBMovieModel } from './shared/model/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, MovieListComponent],
  template: `
    <app-shell>
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
    </app-shell>
  `,
})
export class AppComponent {
  movies = signal<TMDBMovieModel[]>([]);

  loading = computed(() => this.movies().length === 0);

  favoriteMovieIds = signal(new Set<string>(['the-god-2']));

  // depends on movies() & favoriteMovieIds()
  favoriteMovies = computed<TMDBMovieModel[]>(() => {
    console.log('computing new favoriteMovies', this.movies());
    return this.movies().filter(movie => this.favoriteMovieIds().has(movie.id));
  });

  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get<{
        results: TMDBMovieModel[];
      }>(`${environment.tmdbBaseUrl}/3/movie/popular`, {
        headers: {
          Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
      })
      .subscribe(response => {
        setTimeout(() => {
          this.movies.set(response.results);
        }, 1500);
      });
  }

  toggleFavorite(movie: TMDBMovieModel) {
    console.log('toggled', movie);
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
