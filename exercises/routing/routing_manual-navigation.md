# Exercise: Manual Navigation: Movie Search

In this exercise you will learn how to manually trigger navigation events without a `routerLink`.
We want to use the `router.navigate` API in order to implement a movie search functionality

## 0. Add searchMovies function to MovieService

The first thing we need is an API to call in order to get a result when we search for movies.
Let's introduce a new method `searchMovies(query: string): Observable<{ results: TMDBMovieModel[] }>`
in the `MovieService`.

The method should send a request to `${environment.tmdbBaseUrl}/3/search/movie`
with the following options:

```ts
{
  headers: {
    Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
  },
  params: { query },
}
```

<details>
  <summary>searchMovies method</summary>

```ts
// src/app/movie/movie.service.ts

/* before ..*/

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

```

</details>

Great, let's continue with the router configuration!

## 1. Add /search route

Add a new route configuration to the `app.routes.ts`. It should have `/search` as a path and `:query` as a
parameter. You don't need to introduce a new component for this, we are again going to use `MovieListPageComponent`.

<details>
  <summary>/search route configuration</summary>

```ts
// src/app/app.routes.ts

/* before */

{
  path: 'search/:query',
  component: MovieListPageComponent,
},

/* after */

```

</details>

Well done, let's continue by using the new parameter in the `MovieListPageComponent`.

## 2. React to `query` parameter in `MovieListPageComponent`

Until now, the `MovieListPageComponent` only cared about the `category` param. We need to implement logic to
also react to `query` as a parameter.

Use an if condition in `MovieListPageComponent`s subscription to the `parameters` to check if you have a `query` parameter or not.
Depending on the outcome, use the `searchMovies(params.query)` method instead of `getMovies(params.categoryId)`.

<details>
  <summary>MovieListPage reacts to search query</summary>

```ts
// src/app/movie/movie-list-page/movie-list-page.component.ts

constructor() {
  this.route.params.subscribe(params => {
    this.movies.set([]);
    if (params.query) { // 👈️ perform search when we have a query
      this.movieService.searchMovies(params.query).subscribe(data => {
        this.movies.set(data.results);
      });
    } else {
      this.movieService.getMovies(params.category).subscribe(data => {
        this.movies.set(data.results);
      });
    }
  });
}

```

</details>

Well done! You can already check if your new route works, by entering e.g. `/search/batman` into the address bar.

## 3. Navigate on input from search bar

Let's perform the manual navigation based on the search input from the search bar.
We want to `inject` the `Router` into the `AppShellComponent` and use its `.navigate` event to navigate when
an event happens.
The event handler should be a new method `search(query: string)` in the `AppShellComponent`. 

Finally, we are going to invoke our callback on the `(searchSubmit)` event of the `ui-search-bar` located in `app-shell.component.html`.

### 3.1 inject the Router

Use the `inject` function from `@angular/core` to inject the `Router` into the `AppShellComponent`.

<details>
  <summary>inject Router</summary>

```ts
// src/app/app-shell/app-shell.component.ts

import { Component, inject } from '@angular/core';
import { Router, /*...*/ } from '@angular/router';

/* before.. */

router = inject(Router);

```

</details>

## 3.2 create a search callback

Create a new method `search(query: string)` that calls the `router.navigate(['/search', query])` method.

<details>
  <summary>search callback</summary>

```ts

// src/app/app-shell/app-shell.component.ts

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

/* before.. */

router = inject(Router);

search(query: string) {
  this.router.navigate(['/search', query]);
}

/* after */


```

</details>

## 3.3 invoke callback

Now open the `app-shell.component.html` and locate the `ui-search-bar` component.
Bind the search callback to the `(searchSubmit)` output and pass it's `$event` as argument.

<details>
  <summary>Invoke callback</summary>

```html

<ui-search-bar (searchSubmit)="search($event)"/>

```

</details>

Well done! You can try out searching via the search bar now :)


## Full Solution

<details>
  <summary>AppShellComponent</summary>

```ts

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    SideDrawerComponent,
    FastSvgComponent,
    HamburgerButtonComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppShellComponent {
  sideDrawerOpen = false;

  router = inject(Router);

  search(query: string) {
    this.router.navigate(['/search', query]);
  }
}


```

</details>

<details>
  <summary>MovieListPageComponent</summary>

```ts

import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MovieModel, TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';

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
        (toggleFavorite)="toggleFavorite($event)" />
    }
  `,
  styles: ``,
})
export class MovieListPageComponent {
  movies = signal<TMDBMovieModel[]>([]);

  loading = computed(() => this.movies().length === 0);

  favoriteMovieIds = signal(new Set<string>(), {
    equal: () => false,
  });

  favoriteMovies = computed(() =>
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe(params => {
      this.movies.set([]);
      if (params.query) {
        this.movieService.searchMovies(params.query).subscribe(data => {
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


```

</details>

<details>
  <summary>app.routes.ts</summary>

```ts

import { Routes } from '@angular/router';

import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';
import { NotFoundPageComponent } from './movie/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/:category',
    component: MovieListPageComponent,
  },
  {
    path: 'search/:query',
    component: MovieListPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
];


```

</details>
