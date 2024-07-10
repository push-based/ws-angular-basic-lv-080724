import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { insert, remove } from '@rx-angular/cdk/transformations';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { FavoriteMovie, TMDBMovieModel } from '../shared/model/movie.model';
import { TMDBMovieGenreModel } from '../shared/model/movie-genre.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private httpClient = inject(HttpClient);

  getMovies(category: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/movie/${category}`
    );
  }

  searchMovies(query: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/search/movie`,
      {
        params: { query },
      }
    );
  }

  getGenres(): Observable<{ genres: TMDBMovieGenreModel[] }> {
    return this.httpClient.get<{ genres: TMDBMovieGenreModel[] }>(
      `${environment.tmdbBaseUrl}/3/genre/movie/list`
    );
  }

  getMoviesByGenre(genreId: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/discover/movie`,
      {
        params: {
          with_genres: genreId,
        },
      }
    );
  }

  getFavorites(): FavoriteMovie[] {
    return (
      (JSON.parse(
        localStorage.getItem('my-movies') as string
      ) as FavoriteMovie[]) || []
    );
  }

  removeFavorite(movie: FavoriteMovie) {
    const favorites = remove(this.getFavorites(), movie, 'id');
    localStorage.setItem('my-movies', JSON.stringify(favorites));
  }

  addFavorite(movie: FavoriteMovie) {
    const favorites = insert(this.getFavorites(), movie);
    localStorage.setItem('my-movies', JSON.stringify(favorites));
  }
}
