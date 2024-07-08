# Exercise: Control Flow - @for

In this exercise you'll learn how to use angulars control flow syntax to repeat multiple templates.

## 1. Create an array of movies

The first thing we need to repeat our templates is a data structure to iterate over. 
Let's create a `movies = []` property in the `AppComponent` and fill it with multiple movies.
You multiply the one you already have, or manipulate the data yourself. There are also examples in `src/app/data/movie-mock.json`
if you like to take data from there.

<details>
  <summary>Create movies array & introduce `id`</summary>

```ts
// src/app/app.component.ts

movies = [
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

```

</details>

## 2. Use @for to iterate over movies

Now let's use the `@for` control flow to repeat the movie card template and show multiple of them.

> [!NOTE]
> Please don't forget to use a `track`
> You should specify to use the `id` property for tracking down a movie

<details>
  <summary>Use @for to show multiple movies</summary>

Place the `@for` block directly before the `div.movie-card`.

```html
<!-- src/app/app.component.ts -->

<app-shell>
  @for (movie of movies; track movie.id) {
    
  }
</app-shell>

```

Within the `@for` block we now put the `div.movie-card`. This tells angular to repeat the enclosed template
for each defined item in the `movies` array.

```html
<!-- src/app/app.component.ts -->

<app-shell>
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
      [class.is-favorite]="isFavorite"
      (click)="toggleFavorite(movie)">
        @if (isFavorite) {
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

Great job, check out the application and see if you now got multiple movies being displayed to the UI.

You can btw. safely delete the `movie` property now.

## 3. Update the favorite behavior

You might have noticed that we only have a single state for the movies to be favoured or not. This results in a broken
behavior now. In a real world scenario we would like to maintain a list of favorite movies. We can implement such a behavior with a very simple
and very efficient look up table.

Let's create a `favoriteMovieIds: Set` that holds all the ids of movies that are marked as favorite.
In order to make it work, we also need to adjust the `toggleFavorite` method.
It should `delete` the `movie.id` to the set, when the set `has` the current `movie.id`. Otherwise, 
it should `add` the `movie.id` to it.

<details>
  <summary>Create the favoriteMovieIds Set & adjust toggleFavorite</summary>

```ts
// src/app/app.component.ts

favoriteMovieIds = new Set();

toggleFavorite(movie) {
  // if we have it already, remove it. Otherwise, add it
  if (this.favoriteMovieIds.has(movie.id)) {
    this.favoriteMovieIds.delete(movie.id);
  } else {
    this.favoriteMovieIds.add(movie.id);
  }
}

```

</details>

As a final step, we also want to remove the old `isFavorite` property and
bind the `favoriteMovieIds` to the template.

Replace `isFavorite` with `favoriteMovieIds.has(movie.id)` in the template.

<details>
  <summary>Use favoriteMovieIds in the template</summary>

```html
<!-- src/app/app.component.ts -->

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

```

</details>

## 4. Create a favorite widget

We want to implement a very simple favorite movie widget. It should display the titles of all
movies that we currently marked as favorite.

### FavoriteMovies derived state

Create a `favoriteMovies` function in `AppComponent` that returns a filtered `movies` array, based on
what is available in the favoriteMovieIds set.

<details>
  <summary>favoriteMovies()</summary>

> [!NOTE]
> You can implement this in multiple ways, as a class function, an anonymous function
> or a `getter`. You can choose whatever way you like.

```ts
// src/app/app.component.ts

favoriteMovies = () => {
  return this.movies.filter(movie => this.favoriteMovieIds.has(movie.id));
};

```

</details>

Great, now we can use the `favoriteMovies` function in the template to render a list of movie titles.

### FavoriteMovies widget

> ![TIP]
> If you want to have some favorites always in the set, just put two ids into the Sets constructor
> e.g. `new Set(['the-god'])`

Create a `div.favorite-widget` above the `@for(movie of movies)` section. 

Within, create another `@for` loop to iterate over all `favoriteMovies()`.
For each `favorite` create a `<span>{{ favorite.title }}</span>`.

<details>
  <summary>.favorite-widget</summary>

```html

<div class="favorite-widget">
  @for (fav of favoriteMovies(); track fav) {
    <span>{{ fav.title }}</span>
  }
</div>
```

</details>

### Line separator

Let's improve the visuals a bit by putting a separator between the titles.
You can choose whatever icon you like for that :).

The goal is to put a separator only if the item is not the last one. Otherwise we end up putting
the separator to all items.

For this, assign a variable to the `$last` context from the `@for` loop and use it to define
a condition with `@if` to display a separator.

<details>
  <summary>line separator</summary>

```html

<div class="favorite-widget">
  @for (fav of favoriteMovies(); track fav) {
  
    <span>{{ fav.title }}</span>
    
    @if (!$last) {
      <span>•</span>
    }
  }
</div>
```

</details>

## Full Solution

<details>
  <summary>Full Template</summary>


```html
<app-shell>
  <div class="favorite-widget">
    @for (fav of favoriteMovies(); track fav) {
      <span>{{ fav.title }}</span>
      @if (!$last) {
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
```

</details>

<details>
  <summary>Full Component</summary>

```ts
export class AppComponent {
  movies = [
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

  favoriteMovieIds = new Set();

  favoriteMovies = () => {
    return this.movies.filter(movie => this.favoriteMovieIds.has(movie.id));
  };

  toggleFavorite(movie) {
    if (this.favoriteMovieIds.has(movie.id)) {
      this.favoriteMovieIds.delete(movie.id);
    } else {
      this.favoriteMovieIds.add(movie.id);
    }
  }
}
```

</details>
