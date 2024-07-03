# Exercise: Services & Dependency Injection intro

In this exercise you will learn a new building block of the angular ecosystem, `Services`, or rather `@Injectable()`.
Furthermore, you will get to know the basics of angulars dependency injection system and the new `inject` method.

You will introduce the service `MovieService` which will serve as our abstraction layer for accessing the `TMDBMovieApi`.

## 1. Introduce MovieService

create a new service `MovieService` in the `movie` folder. It should be providedIn `root`.

<details>
    <summary>Create `MovieService`</summary>

`ng g s movie/movie`

you should end up having the following `MovieService`

```ts
// src/app/movie/movie.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  
}
```

</details>

As we want to fetch data in this service, inject the `HttpService`. Instead of using the constructor based injection,
use the `inject` method provided by the `@angular/core` package.

<details>
  <summary>Inject `HttpService`</summary>


```ts
// src/app/movie/movie.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private httpClient = inject(HttpClient);
}

```

</details>

Now start implementing the first method for re-usage in our components:
* method to fetch movies by `getMovies(category: string): Observable<{ results: TMDBMovieModel[] }>`

<details>
    <summary>MovieService implementation</summary>

```ts
// movie.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TMDBMovieModel } from '../shared/model/movie.model';

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
}

```
</details>

Now we want to make use of our `MovieService` in the `AppComponent`.

Go to the `AppComponent`, inject the `MovieService` and replace it with the `HttpClient`.
Also replace the constructor based injection with the new `inject` method.

Use one of the following categories as input:
* `popular`
* `top_rated`
* `upcoming`

<details>
    <summary>Use MovieService</summary>

```ts
// app.component.ts

private movieService = inject(MovieService);

constructor() {
  this.movieService.getMovies('popular').subscribe(data => {
    this.movies.set(data.results);
  });
}
```

</details>

Well done! Serve the application, the movie list should still be visible.

## 2. Extend MovieService with genres

Even thought we are not needing those methods right now, this will be useful for upcoming exercises :).

Let's add more methods to the `MovieService` for later re-usage

* method to fetch genres `getGenres()`
* method to fetch movies by genreId `getMoviesByGenre(genreId: string)`

Information for the genres request:
* [`/genre/movie/list`](https://developers.themoviedb.org/3/movies/get-movie-credits)
* returns `{ genres: TMDBMovieGenreModel[] }` (`shared/model/movie-genre.model.ts`)

Information for the movies by genre request:
* [`/discover/movie?with_genres`](https://developers.themoviedb.org/3/discover/movie-discover)
* returns `{ results: TMDBMovieModel[] }`
* use `params: { with_genres: genre }` to send the queryparams

<details>
  <summary>MovieService Genre Methods</summary>

```ts
// movie.service.ts

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
```

</details>
