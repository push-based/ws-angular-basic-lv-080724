# Exercise: Router Lazyloading + Genre Display

In this exercise you will learn a simple technique to speed up the loading time of your application.

Until now, we have a working router configuration which enables our users to display different set
of movies as well as give information about not existing pages.

However, our application is eagerly loading all components as initial bundle. Regardless
of the component being displayed, the user has to download and evaluate every other existing component
as well.

Luckily, angular provides a very simple mechanic to improve this situation and letting users only download
what they really need.

Right now only have 1 component that isn't needed all the time: `NotFoundPageComponent`. Let's lazyload it.

## 1. Lazyload NotFoundPageComponent

As we have implemented the all components as `standalone` components, you will have a very easy time
to implement lazyloading.

Your task is to implement the following technique for the `NotFoundPageComponent` in the `app.routes.ts` file.

```ts
// replace existing routes for notfound page

{
    path: '',
    loadComponent: () => import('path/to/component').then(m => m.ComponentToLazyLoad),
},

```

<details>
    <summary>Lazy load NotFoundPageComponent</summary>

```ts
// app-routing.module.ts

/* before */

{
  path: '**',
  loadComponent: () =>
    import('./not-found-page/not-found-page.component').then(
      m => m.NotFoundPageComponent
    ),
},

/* after */

```

</details>

> [!NOTE]
> Don't forget to remove the static import to `NotFoundPageComponent`, otherwise angular isn't able to lazy load it properly.

Serve the application, you should notice that the bundler now produces a new bundle, grouped under `Lazy chunk files`:

```shell
Initial chunk files | Names                    | Raw size
main.js             | main                     | 56.51 kB | 

Lazy chunk files    | Names                    | Raw size
chunk-DRCJ5JAW.js   | not-found-page-component |  1.64 kB | 👈️👈️👈️👈️

Application bundle generation complete. [0.080 seconds]

```

Congratulations, you have successfully created a lazy chunk the router now downloads on demand when the user needs it.

## 2. BONUS: Also make `genres` accessible

> [!NOTE]
> This is a BONUS exercise. You don't have to complete this.
> The description is also less verbose, so it's quite a challenge.
> Anyway, the full solution is visible at the bottom of this exercise - so don't worry.


I hope you do remember that we've added the `getGenres` & `getMoviesByGenre` methods.
Well, it wasn't just for fun. Let's use them!

### 2.1 introduce genre/:genreId route

Introduce a new route configuration for `genre/:genreId` that also points to `MovieListPageComponent`.

### 2.2 make MovieListPageComponent aware of the new parameter

Use another if/else condition in `MovieListPageComponent`s subscription to the `parameters` to check if you have a `genreId` parameter or not.
Depending on the outcome, use the `getMoviesByGenre(params.genreId)` method.

### 3.3 fetch genres

In the `AppShellComponent`, do the same approach as we did for the movies in the `MovieListPageComponent`.
Create a `genres: Signal<TMDBMovieGenreModel[]>` and feed it with the data from `getGenres()` of the `MovieService`.

### 4.4 display genres as navigation links

Use `@for(genre of genres(); track genre.id)` to iterate over the genres and generate
a `[routerLink]="[]"` for each category.
Use `{{ genre.name ]}` as label

It should be very similar to what we did for the categories.

## Full Solution

<details>
  <summary>AppShellComponent Class</summary>

```ts

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { MovieService } from '../movie/movie.service';
import { TMDBMovieGenreModel } from '../shared/model/movie-genre.model';
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

  private router = inject(Router);
  private movieService = inject(MovieService);

  genres = signal<TMDBMovieGenreModel[]>([]);

  constructor() {
    this.movieService.getGenres().subscribe(result => {
      this.genres.set(result.genres);
    });
  }

  search(term: string) {
    this.router.navigate(['/search', term]);
  }
}

```

</details>

<details>
  <summary>AppShellComponent Template</summary>

```html

<ui-side-drawer
  [opened]="sideDrawerOpen"
  (openedChange)="sideDrawerOpen = $event">
  <a class="navigation-header" href="/">
    <picture srcset="/assets/images/logo.svg" media="(min-width: 80em)">
      <img
        class="logo-img"
        src="/assets/images/logo.svg"
        title="HubMovies"
        alt="HubMovies"
        width="150"
        height="150" />
    </picture>
  </a>
  <nav class="navigation">
    <h3 class="navigation--headline">Discover</h3>

    <!-- Insert popular, top_rated & upcoming links here -->

    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'popular']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="popular" />
        Popular
      </div>
    </a>
    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'top_rated']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="top_rated" />
        Top Rated
      </div>
    </a>
    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'upcoming']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="upcoming" />
        Upcoming
      </div>
    </a>

    <h3 class="navigation--headline">Genres</h3>

    <!-- Insert Genre links here -->

    @for(genre of genres(); track genre.id) {
    <a
      class="navigation--link"
      [routerLink]="['/genre', genre.id]"
      routerLinkActive="active">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="genre" />
        {{ genre.name }}
      </div>
    </a>
    }

  </nav>
  <div class="menu-footer">
    <a
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noreferrer noopener">
      <picture class="tmdb-mark">
        <source
          srcset="/assets/images/tmdbgreen.svg"
          media="(prefers-color-scheme: dark)" />
        <source
          srcset="/assets/images/tmdb.svg"
          media="(prefers-color-scheme: light)" />
        <img width="300" height="118" alt="The Movie Database" src="" />
      </picture>
    </a>
  </div>
</ui-side-drawer>
<div class="content-wrapper">
  <div class="ui-toolbar">
    <ui-hamburger-button
      data-uf="menu-btn"
      class="ui-toolbar--action"
      (click)="sideDrawerOpen = !sideDrawerOpen">
    </ui-hamburger-button>
    <div class="ui-toolbar--widget-container">
      <ui-search-bar (searchSubmit)="search($event)"></ui-search-bar>
      <ui-dark-mode-toggle></ui-dark-mode-toggle>
      <fast-svg name="account" size="35"></fast-svg>
    </div>
  </div>
  <div class="content">
    <ng-content></ng-content>
  </div>
</div>


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
  movies = signal<TMDBMovieModel[] | null>(null);

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


```

</details>

<details>
  <summary>app-routes.ts</summary>

```ts

import { Routes } from '@angular/router';

import { isCategoryGuard } from './is-category.guard';
import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/:category',
    component: MovieListPageComponent,
    canMatch: [isCategoryGuard],
  },
  {
    path: 'search/:query',
    component: MovieListPageComponent,
  },
  {
    path: 'genre/:genreId',
    component: MovieListPageComponent,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found-page/not-found-page.component').then(
        m => m.NotFoundPageComponent
      ),
  },
];



```

</details>

