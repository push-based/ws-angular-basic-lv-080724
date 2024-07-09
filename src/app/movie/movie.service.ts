import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TMDBMovieModel } from '../shared/model/movie.model';
import { TMDBMovieGenreModel } from '../shared/model/movie-genre.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private httpClient = inject(HttpClient);

  getMovies(category: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/movie/${category}`,
      {
        headers: {
          Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
      }
    );
  }

  searchMovies(query: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/search/movie`,
      {
        headers: {
          Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
        params: { query },
      }
    );
  }

  getGenres(): Observable<{ genres: TMDBMovieGenreModel[] }> {
    return this.httpClient.get<{ genres: TMDBMovieGenreModel[] }>(
      `${environment.tmdbBaseUrl}/3/genre/movie/list`,
      {
        headers: {
          Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
      }
    );
  }

  getMoviesByGenre(genreId: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/discover/movie`,
      {
        headers: {
          Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
        params: {
          with_genres: genreId,
        },
      }
    );
  }
}
