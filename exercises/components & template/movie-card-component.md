# Exercise: Create MovieCardComponent

In this exercise we want to create a reusable `MovieCardComponent` which is responsible for displaying
a single movie as a card on the screen. We are also going to learn a new type of `input`, the `model`!

## 1. Create MovieCard component skeleton

Let's start by using the `ng generate component` command to create a `movie-card` component in the `movie/` folder.

<details>
    <summary>generate MovieCardComponent</summary>

```bash
ng generate component movie/movie-card

OR

ng g c movie/movie-card
```

As our workspace is configured to generate single file components, you should now see 1 files being generated:

* `src/app/movie/movie-card/movie-card.component.ts` => component logic


If you want to have a separate file for the styles and/or the template, please use

```bash
ng generate component movie-card --inline-style=false --inline-template=false

OR

ng g c movie-card --inline-style=false --inline-template=false
```

It'll generate:

* `src/app/movie/movie-card/movie-card.component.ts` => component logic
* `src/app/movie/movie-card/movie-card.component.html` => template (--inline-template=false)
* `src/app/movie/movie-card/movie-card.component.scss` => stylesheet (--inline-style=false)

</details>

Great, now open the newly created file(s) and check what was generated.

The result (depending on your choices), should look similar to this:

<details>
  <summary>MovieCardComponent Skeleton</summary>

```ts
// src/app/movie/movie-card/movie-card.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [],
  template: ` <p>movie-card works!</p> `,
  styles: ``,
})
export class MovieCardComponent {}


```

</details>

## 2. Define MovieCardComponent API

Now it's time for us to define the components API, by introducing `input` and `output`s respectively for what we want
to achieve.

The `MovieCardComponent` should have two `input`s:
* `movie = input.required<MovieModel>()`
* `favorite = model(false)` <- is also an input, but a mutable one and an output emitter at the same time


<details>
  <summary>MovieCardComponent Inputs & Models</summary>

```ts
// src/app/movie/movie-card/movie-card.component.ts

import { Component, input, model } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';

@Component(/**/)
export class MovieCardComponent {
  
  movie = input.required<MovieModel>();
  favorite = model(false);
}


```

</details>


## 3. Migrate code to MovieCardComponent

As the template is already implemented in `MovieListComponent`, let's migrate
everything related to the movie-card into it: the whole `div.movie-card` and all of its children.

You don't need to migrate any typescript code. And no worries, you can just **cut** out the contents, they don't
need to stay in `MovieListComponent` anymore. 

When migrating the template you notice that you also need to slightly adjust it:
* read the `movie` value from signal -> `movie()`
* instead of `favoriteMovieIds().has(movie.id)` -> use the new `favorite()` input
* instead of calling `toggleFavorite.emit(movie)` -> we actually need to toggle the `favorite()` value

<details>
    <summary>Migrate to MovieCardComponent</summary>

Create a new `toggle` method in `MovieCardComponent`. It should set or update the `favorite` model to its negated
value.

```ts
// src/app/movie/movie-card/movie-card.component.ts

export class MovieCardComponent {
  movie = input.required<MovieModel>();
  favorite = model(false);

  toggle() {
    this.favorite.set(!this.favorite());
  }
}
```

Migrate the template from `MovieListComponent` to the `MovieCardComponent`

```html
<!-- src/app/movie/movie-card/movie-card.component.ts -->

<div class="movie-card">
  <img
    class="movie-image"
    [alt]="movie().title"
    [src]="'https://image.tmdb.org/t/p/w342' + movie().poster_path" />
  <div class="movie-card-content">
    <div class="movie-card-title">{{ movie().title }}</div>
    <div class="movie-card-rating">{{ movie().vote_average }}</div>
  </div>
  <button
    class="favorite-indicator"
    [class.is-favorite]="favorite()"
    (click)="toggle()">
    @if (favorite()) {
      I like it
    } @else {
      Like me
    }
  </button>
</div>
```

</details>

## 4. use movie-card

Great job, the `MovieCardComponent` is feature complete for now. Let's finally make use of it in the `MovieListComponent`
and see how it works :).

Use `movie-card` inside of `MovieListComponent`s template and bind to its `input`s and `output`s:

* `[movie]="movie"`
* `[favorite]="favoriteMovieIds().has(movie.id)"`
* `(favoriteChange)="toggleFavorite.emit(movie)"`

As the `MovieListComponent` now consumes the `movie-card`, don't forget to put it into the `imports` array.

Of course, if not done before, remove the old .movie-card implementation.

<details>
    <summary>Use `MovieCardComponent` in `MovieListComponent`</summary>

```html
<!-- src/app/movie/movie-list/movie-list.component.ts -->

@for (movie of movies(); track movie.id) {
  <movie-card
    [movie]="movie"
    [favorite]="favoriteMovieIds().has(movie.id)"
    (favoriteChange)="toggleFavorite.emit(movie)" />
}
```

If not autocompleted from your IDE, let's make sure the imports are good:

```ts
// src/app/movie/movie-list/movie-list.component.ts

import { MovieCardComponent } from './movie/movie-card/movie-card.component';

@Component({
  selector: 'movie-list',
  imports: [MovieCardComponent],
  /**/
})
export class MovieListComponent {}
```

</details>

Very well done!

Serve the application and make sure `movie-card` component is actually rendered in your browser.

In case it isn't running any longer: 

```bash
ng serve

# or

npm run start
```

## 5. Make it beautiful 💅

Now we want to make the movie-card a little bit more visually appealing, so let's add some styles to it.

For those who chose to go with the single file component, add the following snippet to the `styles` property of the
`MovieCardComponent`s component decorator.

Otherwise, add it to the `movie-card.component.scss` file.

<details>
  <summary>MovieCardComponent Styles</summary>

```scss
/* src/app/movie/movie-card/movie-card.component.ts */

.movie-card {
  transition: box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  transform-origin: bottom;
}

.movie-card:hover {
  .movie-image {
    transform: scale(1);
  }
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.6);
}

.movie-image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  transform: scale(0.97);
}

.movie-card-content {
  text-align: center;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
}

.movie-card-title {
  font-size: 2rem;
}

```

</details>

## 6. Use the `ui-star-rating` component instead of displaying just a number

There is a pre-made component ready for usage which can show a beautiful list of stars
instead of just a number. You might want to use just that component.

It has an input `rating` which you want to bind the `movie().vote_average` to.

<details>
    <summary>ui-star-rating usage</summary>

Replace `{{ movie().vote_average }}`

with `<ui-star-rating [rating]="movie().vote_average" />`

in `MovieCardComponent`.

Of course check that the imports are good:

```ts
// src/app/movie/movie-card/movie-card.component.ts

import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [StarRatingComponent]
})
export class MovieCardComponent { }
```

</details>

## Full Solution

<details>
  <summary>MovieCardComponent</summary>

```ts
import { Component, input, model } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [StarRatingComponent],
  template: `
    <div class="movie-card">
      <img
        class="movie-image"
        [alt]="movie().title"
        [src]="'https://image.tmdb.org/t/p/w342' + movie().poster_path" />
      <div class="movie-card-content">
        <div class="movie-card-title">{{ movie().title }}</div>
        <div class="movie-card-rating">
          <ui-star-rating [rating]="movie().vote_average" />
        </div>
      </div>
      <button
        class="favorite-indicator"
        [class.is-favorite]="favorite()"
        (click)="toggle()">
        @if (favorite()) {
          I like it
        } @else {
          Like me
        }
      </button>
    </div>
  `,
  styles: `
    .movie-card {
      transition:
        box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    }

    .movie-card:hover {
      .movie-image {
        transform: scale(1);
      }
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.6);
    }

    .movie-image {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      transform: scale(0.97);
    }

    .movie-card-content {
      text-align: center;
      padding: 1.5rem 3rem;
      font-size: 1.5rem;
    }

    .movie-card-title {
      font-size: 2rem;
    }
  `,
})
export class MovieCardComponent {
  movie = input.required<MovieModel>();
  favorite = model(false);

  toggle() {
    this.favorite.set(!this.favorite());
  }
}

```

</details>

<details>
  <summary>MovieListComponent</summary>

```ts
import { Component, input, output } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    @for (movie of movies(); track movie.id) {
      <movie-card
        [movie]="movie"
        [favorite]="favoriteMovieIds().has(movie.id)"
        (favoriteChange)="toggleFavorite.emit(movie)" />
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
