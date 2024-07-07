# Exercise: angular movies intro & template interpolation

In this exercise, we want to get to know the codebase a bit and also create our first template expressions in the `AppComponent`.

## 0. serve application

The first task is to actually run the application. Please go to the installed
workshop project and `serve` the existing application.

```bash
ng serve -o

# or

npm run start
```

## 1. implement movie-card template

Go to `AppComponent` and add the html for a static `movie-card` into its template.

<details>
    <summary>Show snippet</summary>

go to `src/app/app.component.ts`

Insert the movie-card template as static html into the app components template.

> Notice: please insert the movie-card as body of the `app-shell`. Don't remove it.

```html
<app-shell>
  <div class="movie-card">
    <img
      class="movie-image"
      src="https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg" />
    <div class="movie-card-content">
      <div class="movie-card-title">The Godfather</div>
      <div class="movie-card-rating">10</div>
    </div>
    <button class="favorite-indicator"></button>
  </div>
</app-shell>
```

</details>

You can already serve the application and observe the template displaying a static movie-card.

## 2. Create a movie object

Let's take it one step further and bind actual data to our template.
For that, first add a local `movie` field to the `AppComponent` holding three properties:

* `id: string` <- important that id is a `string` 
* `title` 
* `poster_path `
* `vote_average`

<details>
  <summary>movie variable</summary>

go to `src/app/app.component.ts`

```ts
// app.component.ts

// movie object for data binding
movie = {
    id: 'the-god',
    title: 'The Godfather',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    vote_average: 10
}
```
</details>

## 3. Bind the movie object to the template

After that, go to `app.component.ts` template and bind the `movie` objects properties to the template.

> [!NOTE]
> For the `src` attribute of the image we need string concatenation. The property of the movie only
> holds the end of the whole path: `{{ 'https://image.tmdb.org/t/p/w342' + movie.poster_path }}`

<details>
    <summary>template interpolation</summary>

Apply template binding

go to `src/app/app.component.ts`

```html
<!-- app.component.html -->

<div class="movie-card">
    <img class="movie-image"
         src="{{ 'https://image.tmdb.org/t/p/w342' + movie.poster_path }}">
    <div class="movie-card-content">
        <div class="movie-card-title">
            {{ movie.title }}
        </div>
        <div class="movie-card-rating">
            {{ movie.vote_average }}
        </div>
    </div>
    <button class="favorite-indicator"></button>
</div>
```
    
</details>

Serve the application and observe the movie card being displayed according to the values you've set.

```bash
ng serve
# or
npm run start
```
