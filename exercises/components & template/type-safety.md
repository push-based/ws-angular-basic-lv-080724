# Exercise: Type Safety

In this exercise we want to introduce a little bit of type safety to our app. Until now we only worked with inferred `any` types.
This is very bad practice, so let's switch to proper types to help ourselves maintain the application.

## 1. Create MovieModel

The first thing we want to introduce is a proper type for our movies.

Please open the file `src/app/shared/model/movie.model.ts` and add a new interface called `MovieModel`.
There is an already existing file `TMBDMovieModel` - just place it next to it.

<details>
  <summary>Create MovieModel</summary>

```ts
// src/app/shared/model/movie.model.ts

/* code before, leave as is */

export interface MovieModel {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

```

</details>

## 2. Use MovieModel

Let's use the type we've create before in the `app.component.ts`.

<details>
  <summary>Use MovieModel</summary>

Add the import and use the `MovieModel` to type the `movies` array as `MovieModel[]`.

```ts
// src/app/app.component.ts

import { MovieModel } from './shared/model/movie.model';

/* code in between */

export class AppComponent {
  movies: MovieModel[] = [
    {
      id: 'the-god',
      title: 'The Godfather',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      vote_average: 10,
    },
    {
      id: 'the-god-2',
      title: 'The Godfather part II',
      poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
      vote_average: 9,
    },
    {
      id: 'the-god-3',
      title: 'The Godfather part III',
      poster_path: '/lm3pQ2QoQ16pextRsmnUbG2onES.jpg',
      vote_average: 10,
    },
  ];
}

```

Also use the `MovieModel` to type the `movies` input in the `toggleFavorite` function.

```ts
toggleFavorite(movie: MovieModel) {
  if (this.favoriteMovieIds.has(movie.id)) {
    this.favoriteMovieIds.delete(movie.id);
  } else {
    this.favoriteMovieIds.add(movie.id);
  }
}
```

</details>

## 3. Define type for favoriteMovieIds

As a last improvement, we are going to type the `favoriteMovieIds` set to be a `Set<string>`.

<details>
  <summary>Strongly type favoriteMovieIds</summary>

```ts

favoriteMovieIds = new Set<string>();

```

</details>

## Full Solution

<details>
  <summary>src/app/app.component.ts</summary>


```ts
import { Component } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';
import { MovieModel } from './shared/model/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>
    <div class="favorite-widget">
      @for (fav of favoriteMovies(); track fav; let last = $last) {
        <span>{{ fav.title }}</span>
        @if (!last) {
          <span>•</span>
        }
      }
    </div>
      @for (movie of movies; track movie.id) {
        <div class="movie-card">
          <img
            class="movie-image"
            [alt]="movie.title"
            [src]="'https://image.tmdb.org/t/p/w342' + movie.poster_path" />
          <div class="movie-card-content">
            <div class="movie-card-title">{{ movie.title }}</div>
            <div class="movie-card-rating">{{ movie.vote_average }}</div>
          </div>
          <button
            class="favorite-indicator"
            [class.is-favorite]="favoriteMovieIds.has(movie.id)"
            (click)="toggleFavorite(movie)">
            @if (favoriteMovieIds.has(movie.id)) {
              I like it
            } @else {
              Like me
            }
          </button>
        </div>
      }
    </app-shell>
  `,
})
export class AppComponent {
  movies: MovieModel[] = [
    {
      id: 'the-god',
      title: 'The Godfather',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      vote_average: 10,
    },
    {
      id: 'the-god-2',
      title: 'The Godfather part II',
      poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
      vote_average: 9,
    },
    {
      id: 'the-god-3',
      title: 'The Godfather part III',
      poster_path: '/lm3pQ2QoQ16pextRsmnUbG2onES.jpg',
      vote_average: 10,
    },
  ];

  favoriteMovieIds = new Set<string>();

  favoriteMovies = () => {
    return this.movies.filter(movie => this.favoriteMovieIds.has(movie.id));
  };
  
  toggleFavorite(movie: MovieModel) {
    if (this.favoriteMovieIds.has(movie.id)) {
      this.favoriteMovieIds.delete(movie.id);
    } else {
      this.favoriteMovieIds.add(movie.id);
    }
  }
}

```

</details>

<details>
  <summary>src/app/shared/model/movie.model.ts</summary>

```ts
export interface TMDBMovieModel {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: string;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface MovieModel {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

```

</details>
