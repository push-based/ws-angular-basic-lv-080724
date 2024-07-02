# Exercise: Signals Introduction

In this exercise you'll learn about the new reactive primitive `Signal` and how to use its APIs in an efficient way.

## 1. Transform movies to Signal<MovieModel[]>

Let's make a `Signal` out of our static `movies` property.

<details>
  <summary>Signal<MovieModel[]></summary>

```ts
// src/app/app.component.ts

// the import 
import { Component, signal } from '@angular/core';

/* code in between */

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
```

</details>

Now you also need to change the way how the value is consumed.

Instead of just referencing a signal, we are "calling" its getter function.

<details>
  <summary>Use movies() in the template</summary>

```html
<!-- app.component.ts -->

@for (movie of movies(); track movie.id) {
  <!-- the movie-card -->
}

```

</details>

<details>
  <summary>Use movies() in favoriteMovies()</summary>

```ts
// app.component.ts


favoriteMovies = () => {
  return this.movies().filter(movie => this.favoriteMovieIds.has(movie.id));
};

```

</details>

## 2. Transform favoriteMovieIds to Signal<Set<string>>

The next property we want to be able to read reactively is the `favoriteMovieIds`.
Transform it into a `Signal<Set<string>>`.

You also have to adjust the `toggleFavorite` method in order to work with the new data structure.


> [!WARNING]
> We cannot simply mutate a signals value
> The following snippet **🚧 won't work 🚧**: Angular will never know that the signal got updated.

```ts
// 🚧 won't work 🚧
toggleFavorite(movie) {
  if (this.favoriteMovieIds().has(movie.id)) {
    this.favoriteMovieIds().delete(movie.id);
  } else {
    this.favoriteMovieIds().add(movie.id);
  }
}
```

Instead, there are the `set` or `update` methods in order to feed a signal with new values.
`update` is particularly useful for our case. It lets us compute any update we want based on
the currently available value and return a new value instead.

E.g.:

```ts
this.favoriteMovieIds.update(favoriteMovieIds => {
  if (favoriteMovieIds.has(movie.id)) {
    favoriteMovieIds.delete(movie.id);
  } else {
    favoriteMovieIds.add(movie.id);
  }
  return new Set(favoriteMovieIds);
});
```

> [!TIP]
> Signals are `immutable` by default. If you don't set it an actually "new" value, it won't notify
> consumers about updates.
> This is why you either return an entirely new data structure on updates, or set a custom `equal` function.
> Instead of returning always a new data-structure you could also use the following example:

```ts
favoriteMovieIds = signal(new Set<string>(), {
  // disables equality check entirely and walys notifies about new values
  equal: () => false
});
```

<details>
  <summary>Solution: favoriteMovieIds Signal</summary>

```ts
favoriteMovieIds = signal(new Set<string>(), {
  equal: () => false
});

/* code in between, leave it */

toggleFavorite(movie) {
  this.favoriteMovieIds.update(favoriteMovieIds => {
    if (favoriteMovieIds.has(movie.id)) {
      favoriteMovieIds.delete(movie.id);
    } else {
      favoriteMovieIds.add(movie.id);
    }
    return favoriteMovieIds;
  });
}

```

</details>

Great job! Please run the application and see if everything is working fine.

## 3. Transform favoriteMovies to computed

As a final step we want to also introduce a `computed` to properly derive state from our reactive values.

### 3.1 Let's measure our improvement

But first, let's see what value it brings to our app. Just put a console.log statement inside the `favoriteMovies` function.

```ts
// src/app/app.component.ts

favoriteMovies = () => {
  console.log('favoriteMovies calculated'); // 👈️ this will be funny
  return this.movies().filter(movie => this.favoriteMovieIds().has(movie.id));
}
```

Now run the app and interact with it. Also with the search bar and other UI elements you find on the page
while keeping an eye on the console. You'll notice that `favoriteMovies` will be recalculated on each and every
interaction you are doing on the page.

### 3.2 Let's improve!

Transform the `favoriteMovies` function into a `computed`.

<details>
  <summary>computed favoriteMovies</summary>

```ts
// src/app/app.component.ts

// add the import
import { Component, computed, signal } from '@angular/core';

/* code in between */

favoriteMovies = computed(() => {
  console.log('favoriteMovies calculated');
  return this.movies().filter(movie => this.favoriteMovieIds().has(movie.id));
});

```

</details>

Now run the application. You should notice it's only getting recalculated when one if it's dependencies is actually
changing.

## Full Solution

<details>
  <summary>AppComponent template</summary>

```html
<app-shell>
  <div class="favorite-widget">
    @for (fav of favoriteMovies(); track fav; let last = $last) {
      <span>{{ fav.title }}</span>
      @if (!last) {
        <span>•</span>
      }
    }
  </div>

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
        (click)="toggleFavorite(movie)">
          @if (favoriteMovieIds().has(movie.id)) {
            I like it
          } @else {
            Like me
          }
      </button>
    </div>
  }
</app-shell>
```

</details>

<details>
  <summary>AppComponent class</summary>


```ts
import { Component, signal, computed } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';
import { MovieModel } from './shared/model/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `... see template ;)`
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
    equal: () => false
  });

  favoriteMovies = computed(() => 
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  toggleFavorite(movie) {
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
