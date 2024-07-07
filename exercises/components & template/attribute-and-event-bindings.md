# Exercise: Attribute & Event Bindings

In this exercise we'll deepen our knowledge about angulars template capabilities. You are going to do your
first attribute and event bindings.

## 1. Use an attribute binding

As it is best practice for attribute bindings to use a special syntax instead of pure template interpolation, let's
replace the `src` expression with an actual attribute binding and introduce a binding for `alt`.

Your task is to replace the `src` template expression of your `img.movie-image` with an attribute binding & introduce an `alt`
binding. Bind `[alt]` to the `movie.title` property.

<details>
  <summary>Attribute Binding: src & alt</summary>


```html
<!-- app.component.ts -->

<img
  class="movie-image"
  [alt]="movie.title"
  [src]="'https://image.tmdb.org/t/p/w342' + movie.poster_path" />

```

</details>

## 2. Implement an event binding with a callback

As we also want to interact with template events, let's add a `click` `EventListener` to the movie-card template and
print out the event.

Start by creating a method `toggleFavorite(movie)` in `AppComponent`. The method should accept
1 argument. Print out the parameter passed to the method.

<details>
    <summary>toggleFavorite method</summary>

```ts
// app.component.ts

// event binding function
toggleFavorite(movie) {
  console.log('toggled', movie);
}
```

</details>

Now bind the function as a callback to the `(click)` event of the `button.favorite-indicator`.

<details>
  <summary>Bind toggleFavorite to (click)</summary>

```html
<!-- app.component.ts -->

<button
  class="favorite-indicator"
  (click)="toggleFavorite(movie)"></button>

```

</details>

Great job! Serve the application, see if the card gets displayed properly and the console output gets shown in your
devtools when clicking the movie-card

> Open the dev tools with `F12` or `Ctrl + Shift + I`

```bash
ng serve
# or
npm run start
```


