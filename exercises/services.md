# Exercise: Services & Dependency Injection

In this exercise you will learn a new building block of the angular ecosystem, `Services`.
Furthermore, you will get to know the basics of angulars dependency injection system.

Your will introduce a service `MovieService` which will serve as our abstraction layer for accessing the `TMDBMovieApi`.

## introduce MovieService

create a new service `MovieService` in the `movie` folder. It should be providedIn `root`.

<details>
    <summary>show solution</summary>

`ng g s movie/movie`

you should end up having the following `MovieService`

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }
}
```

</details>

Inject, the `HttpService`.

Now start introducing methods for re-usage in our components:
* method to fetch movies by `getMovies(category: string)` (return value is same as the current `movies$` in `MovieListPageComponent`)
* method to fetch movie by `getMovieById(id: string)`
* method to fetch recommendations `getMovieRecommendations(id: string)`

Information for the byId request:
* [`/movie/${movieId}`](https://developers.themoviedb.org/3/movies/get-movie-details)
* returns `TMDBMovieDetailsModel` (`shared/model/movie-details.model.ts`)

Information for the recommendations request:
* [`/movie/${movieId}/recommendations`](https://developers.themoviedb.org/3/movies/get-movie-recommendations)
* returns `{ results: MovieModel[] }`

Information for the credits request:
* [`/movie/${movieId}/credits`](https://developers.themoviedb.org/3/movies/get-movie-credits)
* returns `{ results: TMDBMovieCreditsModel }` (`shared/model/movie-credits.model.ts`)
* we are only interested in the `cast: TMDBMovieCastModel` property for now though :)
  

<details>
    <summary>MovieService implementation</summary>

```ts
// movie.service.ts

getMovieCredits(id: string): Observable<TMDBMovieCreditsModel> {
    return this.httpClient.get<TMDBMovieCreditsModel>(
        `${tmdbBaseUrl}/3/movie/${id}/credits`
    );
}

getMovieRecommendations(id: string): Observable<{ results: MovieModel[] }> {
    return this.httpClient.get<{ results: MovieModel[] }>(
        `${tmdbBaseUrl}/3/movie/${id}/recommendations`,
        {
            headers: {
                Authorization: `Bearer ${tmdbApiReadAccessKey}`,
            },
        }
    );
}

getMovieById(id: string): Observable<TMDBMovieDetailsModel> {
    return this.httpClient.get<TMDBMovieDetailsModel>(
        `${tmdbBaseUrl}/3/movie/${id}`,
        {
            headers: {
                Authorization: `Bearer ${tmdbApiReadAccessKey}`,
            },
        }
    );
}

getMovies(category: string): Observable<{ results: MovieModel[] }> {
    return this.httpClient.get<{ results: MovieModel[]}>(
        `${tmdbBaseUrl}/3/movie/${category}`,
        {
            headers: {
                Authorization: `Bearer ${tmdbApiReadAccessKey}`,
            },
        }
    );
}
```
</details>


Now we want to make use of our `MovieService` in the `MovieListPageComponent`.

<details>
    <summary>Use MovieService</summary>

Go to the `MovieListPageComponent`, inject the `MovieService` and replace it with the `HttpClient`

```ts
// movie-list-page.component.ts

constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
) {
}

// onInit
this.activatedRoute.params.subscribe((params) => {
    this.movies$ = this.movieService.getMovies(params.category);
});
```

</details>

serve the application, the movie list should still be visible

## Bonus: Implement genre methods

This will be useful for other exercises :)

> If you have those methods already implemented in other components, please just move them over to the `MovieService`
and replace the usage accordingly!

Let's add more methods to the `MovieService` for later re-usage

* method to fetch genres `getGenres()`
* method to fetch movies by genreId `getMovieByGenre(id: string)`

Information for the genres request:
* [`/genre/movie/list`](https://developers.themoviedb.org/3/movies/get-movie-credits)
* returns `{ genres: TMDBMovieGenreModel[] }` (`shared/model/movie-genre.model.ts`)

Information for the movies by genre request:
* [`/discover/movie?with_genres`](https://developers.themoviedb.org/3/discover/movie-discover)
* returns `{ results: MovieModel[] }`
* use `params: { with_genres: genre }` to send the queryparams

<details>
  <summary>MovieService Genre Methods</summary>

```ts
// movie.service.ts

getGenres(): Observable<{ genres: TMDBGenreModel[] }> {
  return this.httpClient.get<{ genres: TMDBGenreModel[] }>(
    `${tmdbBaseUrl}/genre/movie/list`,
    {
      headers: {
        Authorization: `Bearer ${tmdbApiReadAccessKey}`,
      },
    }
  );
}

getMoviesByGenre(genre: string): Observable<{ results: MovieModel[] }> {
  return this.httpClient.get<{ results: MovieModel[] }>(
    `/discover/movie`,
    {
      headers: {
        Authorization: `Bearer ${tmdbApiReadAccessKey}`,
      },
      params: {
          with_genres: genre
      }
    }
  );
}
```

</details>
