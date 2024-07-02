# Exercise: Create MovieListComponent

In this exercise we want to create a reusable `MovieListComponent` which is responsible for displaying
a single movie as a list on the screen.

## 1. Create MovieListComponent component skeleton

Let's start by using the `ng generate component` command to create a `movie-list` component in the `movie/` folder.

<details>
    <summary>generate MovieListComponent</summary>

```bash
ng generate component movie/movie-list

OR

ng g c movie/movie-list
```

As our workspace is configured to generate single file components, you should now see 2 files being generated:

* `src/app/movie/movie-list/movie-list.component.ts` => component logic
* `src/app/movie/movie-list/movie-list.component.spec` => test file


If you want to have a separate file for the styles and/or the template, please use

```bash
ng generate component movie/movie-list --inline-style=false --inline-template=false

OR

ng g c movie/movie-list --inline-style=false --inline-template=false
```

It'll generate:

* `src/app/movie/movie-list/movie-list.component.ts` => component logic
* `src/app/movie/movie-list/movie-list.component.html` => template (--inline-template=false)
* `src/app/movie/movie-list/movie-list.component.scss` => stylesheet (--inline-style=false)
* `src/app/movie/movie-list/movie-list.component.spec` => test file

</details>

Great, now open the newly created file(s) and check what was generated.

The result (depending on your choices), should look similar to this:

<details>
  <summary>MovieListComponent Skeleton</summary>

```ts
// src/app/movie/movie-list/movie-list.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [],
  template: ` <p>movie-list works!</p> `,
  styles: ``,
})
export class MovieListComponent {}


```

</details>

## 2. Define MovieListComponent API

Now it's time for us to define the components API, by introducing `input` and `output`s respectively for what we want
to achieve.

The `MovieListComponent` should have two `input`s:
* `movies = input.required<MovieModel[]>()`
* `favoriteMovieIds = input(Set<string>())` -> not required with an empty set as default


<details>
  <summary>MovieListComponent Inputs</summary>

```ts
// src/app/movie/movie-list/movie-list.component.ts

import { Component, input } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';

@Component(/**/)
export class MovieListComponent {

  movies = input.required<MovieModel[]>();
  favoriteMovieIds = input(new Set<string>());
}


```

</details>


On top of that, the `MovieListComponent` should have an output for the interaction with the favoriteToggle, where we emit
the clicked `MovieModel` to the consumer.

* `favoriteChanged = output<MovieModel>()`

<details>
  <summary>MovieListComponent Output</summary>

```ts
// src/app/movie/movie-list/movie-list.component.ts


import { Component, input, output } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';

@Component(/**/)
export class MovieListComponent {
  movies = input.required<MovieModel[]>();
  favoriteMovieIds = input(new Set<string>());
  
  toggleFavorite = output<MovieModel>();
}

```

</details>


## 3. Migrate code to MovieListComponent

As the template is already implemented in `AppComponent`, let's migrate
everything related to the movie-list into it: the whole `@for` loop that iterates over the movies.

You don't need to migrate any typescript code. And no worries, you can just **cut** out the contents, they don't
need to stay in `AppComponent` anymore. 

When migrating the template you notice that you also need to slightly adjust it:

* instead of calling `toggleFavorite(movie)` -> call `toggleFavorite.emit(movie)`

<details>
    <summary>Migrate to MovieListComponent</summary>

Migrate the template from `AppComponent` to the `MovieListComponent`

```html
<!-- src/app/movie/movie-list/movie-list.component.ts -->

@for (movie of movies(); track movie.id) {
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
    [class.is-favorite]="favoriteMovieIds().has(movie.id)"
    (click)="toggleFavorite.emit(movie)">
    @if (favoriteMovieIds().has(movie.id)) {
      I like it
    } @else {
      Like me
    }
  </button>
</div>
}
```

</details>

## 4. use movie-list

Great job, the `MovieListComponent` is feature complete for now. Let's finally make use of it in the `AppComponent`
and see how it works :).

Use `movie-list` inside of `AppComponent`s template and bind to its `input`s and `output`s:

* `[movies]="movies()"`
* `[favoriteMovieIds]="favoriteMovieIds()"`
* `(toggleFavorite)="toggleFavorite($event)"` <- $event is the special syntax to extract arguments. It'll be typed as `MovieModel`

As the `AppComponent` now consumes the `movie-list`, don't forget to put it into the `imports` array.

Of course, if not done before, remove the old movie-list implementation.

<details>
    <summary>Use `MovieListComponent` in `AppComponent`</summary>

```html
<!-- src/app/app.component.ts -->

<movie-list
  [movies]="movies()"
  [favoriteMovieIds]="favoriteMovieIds()"
  (toggleFavorite)="toggleFavorite($event)" />
```

If not autocompleted from your IDE, let's make sure the imports are good:

```ts
import { MovieListComponent } from './movie/movie-list/movie-list.component';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent, MovieListComponent],
  /**/
})
export class AppComponent {}
```

</details>

Very well done!

Serve the application and make sure `movie-list` component is actually rendered in your browser.

In case it isn't running any longer: 

```bash
ng serve

# or

npm run start
```

## 5. Make it beautiful 💅

Now we want to make the whole application a little bit more visually appealing, so let's add some styles to it.

For those who chose to go with the single file component, add the following snippet to the `styles` property of the
`MovieListComponent`s component decorator.

Otherwise, add it to the `movie-list.component.scss` file.

<details>
  <summary>MovieListComponent Styles</summary>

```scss
/* src/app/movie/movie-list/movie-list.component.ts */

:host {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 35rem));
  gap: 4rem 2rem;
  place-content: space-between space-evenly;
  align-items: start;
  position: relative;
}

```

</details>

Great job! Now see your final result in action and enjoy your super clean app component :).

## Full Solution

<details>
  <summary>MovieListComponent</summary>

```ts

import { Component, input, output } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [],
  template: `
    @for (movie of movies(); track movie.id) {
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
          [class.is-favorite]="favoriteMovieIds().has(movie.id)"
          (click)="toggleFavorite.emit(movie)">
          @if (favoriteMovieIds().has(movie.id)) {
            I like it
          } @else {
            Like me
          }
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 35rem));
      gap: 4rem 2rem;
      place-content: space-between space-evenly;
      align-items: start;
      position: relative;
    }
  `,
})
export class MovieListComponent {
  movies = input.required<MovieModel[]>();
  favoriteMovieIds = input(new Set<string>());
  toggleFavorite = output<MovieModel>();
}


```

</details>

<details>
  <summary>AppComponent</summary>


```ts
import { Component, computed, signal } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';
import { MovieListComponent } from './movie/movie-list/movie-list.component';
import { MovieModel } from './shared/model/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, MovieListComponent],
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
      <movie-list
        [movies]="movies()"
        [favoriteMovieIds]="favoriteMovieIds()"
        (toggleFavorite)="toggleFavorite($event)" />
    </app-shell>
  `,
})
export class AppComponent {
  movies = signal<MovieModel[]>([
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
  ]);

  favoriteMovieIds = signal(new Set<string>(), {
    equal: () => false,
  });

  favoriteMovies = computed(() =>
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

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
