# Exercise: Router setup

In this exercise you will learn the basics of angulars routing system.
The goal of this exercise is to create your first set of components which are accessible
via the router. You will implement a dedicated component to display the current list of movies.

For this you will introduce a new `MoviePageComponent` which will handle the routing
and display the current movies for you.

You will continue bootstrapping and configuring the angular `Router` to setup routes and manage redirects for you.

In the end you will have accomplished the following goals:

* provided & configured the `router`
* added a `RouterOutlet`
* implemented a routable component
* default route to `list/popular`

## 1. Create MovieListPage component

Let's start by introducing a dedicated, routable component. 
Introduce a new component: `MovieListPageComponent`.

<details>
    <summary>generate MovieListPageComponent</summary>

```bash
# generate component
ng g c movie/movie-list-page
```

</details>

The `MovieListPageComponent` in its first state should just do what the `AppComponent` did before.

Please move (just the code, don't delete any component pls!!) everything related to movies (movie-list, favorite-widget, etc.)
including the data-fetching from `AppComponent` to `MovieListPageComponent`.

The `AppComponent`s class should be empty. The template should also be empty besides the remaining `<app-shell></app-shell>`.

You can also safely remove all imports from `AppComponent`.

<details>
    <summary>MovieListPageComponent implementation</summary>

```ts
// movie-list-page.component.ts

import { Component, computed, inject, signal } from '@angular/core';

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

  loading = computed(() => {
    return this.movies().length === 0;
  });

  favoriteMovieIds = signal(new Set<string>(), {
    equal: () => false,
  });

  favoriteMovies = computed(() =>
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);

  constructor() {
    this.movieService.getMovies('popular').subscribe(data => {
      this.movies.set(data.results);
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

## 2. Create Routes & provide Router

Now that we have a component dedicated for our router to work with, all what's left is to provide and configure it.

Create a new `src/app/app.routes.ts` file.

It should export a `export const routes: Routes` and which configures two routes:

* `list/popular` to `MovieListPageComponent`
* `''` redirecting to `list/popular`

> [!TIP]
> `Routes` is an interface coming from `@angular/router` which defines the shape of an array of `Route`.

<details>
  <summary>app.routes.ts</summary>

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/popular',
    component: MovieListPageComponent,
  },
];


```

</details>

Now we are going to tell our application that we want to actually use the router. For this, go to the 
`app.config.ts` file and put the `provideRouter` provider function from the `@angular/router` package
to the list of `providers`.

It requires an input of `Routes`. Import the const we have create before and give it the function as argument.

<details>
  <summary>provideRouter(routes)</summary>

```ts
// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // 👈️

export const appConfig: ApplicationConfig = {
  providers: [
    /* other code */
    provideRouter(routes), // 👈️
    /* other code */
  ],
};


```

</details>

Well done, it's just one more step to have router setup completed!

## 3. Place RouterOutlet

Now we should tell our application where to render the outcome of the router.
Go ahead and add a `<router-outlet />` to the `AppComponent`'s template. This will tell the router to load the configured component
into the outlet if the path matches.

Don't forget to put `RouterOutlet` to the list of imports of the `AppComponent`

<details>
    <summary>use RouterOutlet</summary>

```ts
// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `,
})
export class AppComponent {}

```

</details>

If you haven't already, you can now remove any typescript code from the `AppComponent`, it's just an empty class now!


Congratulations, the router setup is completed. 

Serve the application. The router should navigate you automatically to `list/popular` if you try to navigate to `/`,
you should see movie-list-page being rendered now.

An invalid route though should end up in an error, we will fix that soon!
