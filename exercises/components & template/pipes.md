# Exercise: Pipes

In this exercise you will learn about angulars way to transform raw data from a component inside
the template. For this concept angular uses a building block called `Pipe`.
Before we build our own `Pipe`, let's use one of the built-in pipes.

Let's build our first `Pipe`, the `MovieImagePipe`.

# Advanced way

## 0. Get familiar with a Pipe

Use the `uppercase` Pipe from `@angular/common` for the `.movie-card-title` in the `MovieCardComponent`.

## 1. Implement MovieImagePipe

Implement the pipe `MovieImagePipe`. The pipe should take a `string` input variable.  
It returns a concatenated string of `https://image.tmdb.org/t/p/w342` + the input value.  
If the input value is empty, it should return a placeholder url instead.

As a bonus add a second argument to the `transform` method which allows configuring the `width`
of the fetched image. It should default to `342` and is used to concatenate the url to `https://image.tmdb.org/t/p/w${width}`.

Possible values you can test for the sizes are `300`, `342`, `500`, `780`.

Of course, use the `MovieImagePipe` in the `MovieCardComponent`s template.

<details>
  <summary>Show Help (advanced)</summary>

Placeholder image: `assets/images/no_poster_available.jpg`

```html
<img [src]="movie.poster_path | movieImage">
```

```bash
ng g p movie-image
```

</details>

# Step by Step

## 0. Get familiar with a Pipe

Use the `| uppercase` Pipe on `movie().title` for the `.movie-card-title` in the `MovieCardComponent`.

<details>
  <summary>MovieCardComponent</summary>


```html

<!--movie-card.component.ts-->

<!-- code before -->

<div class="movie-card-content">
  
  <div class="movie-card-title">{{ movie().title | uppercase }}</div>
  
  <!-- code after -->
  
</div>
<!-- code after -->

```

If not autocompleted, don't forget to add the imports

```ts
// movie-card.component.ts

import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [/* */, UpperCasePipe],
})
export class MovieCardComponent {}
```

</details>

Make sure to run the application and see if the movie title is now really printed in upper cases ;).

## 1. implement movie-image pipe

create a `Pipe` to deliver the formatted image url for our movie-card component

It returns a concatenated string of `https://image.tmdb.org/t/p/w300` + the input value.  
If the input value is falsy, it should return a placeholder url instead.

The url to the placeholder image is: `assets/images/no_poster_available.jpg`.

Generate the Pipe:

```bash
ng generate pipe movie/movie-image

OR

ng g p movie/movie-image
```

It'll generate you `src/app/movie/movie.pipe.ts`. Open it up and inspect the skeleton.

You now want to implement the business logic described before within the `transform` method.

<details>
    <summary>MovieImagePipe implementation</summary>

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieImage',
  standalone: true,
})
export class MovieImagePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      return `https://image.tmdb.org/t/p/w342${value}`;
    }
    return `assets/images/no_poster_available.jpg`;
  }
}

```
</details>

## 2. use pipe in movie-card

Go to the `MovieCardComponent`s template and use the `movieImage` pipe in the template to transform the `poster_path`
into the correct image path.

<details>
  <summary>use `MovieImagePipe`</summary>

```html
<!-- movie-card.component.html -->

<img class="movie-image" [src]="movie.poster_path | movieImage">
```

If not autocompleted, make sure you've added the correct imports.

```ts
// movie-card.component.ts

import { MovieImagePipe } from '../movie-image.pipe';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [/* */, MovieImagePipe],
})
export class MovieCardComponent {}
```

</details>

Try out the fallback image by setting the `poster_path` property in the `AppComponent` to an empty string `''`.
The poster should now be displaying the fallback image.

## 3. make pipe configurable

As a bonus add a second argument to the `transform` method which allows configuring the `width`
of the fetched image. It should default to `342` and is used to concatenate the url to `https://image.tmdb.org/t/p/w${width}`.

<details>
  <summary>Configurable Pipe</summary>


```ts
// movie-image.pipe.ts

transform(value: string, width = 342): string {
  if (value) {
    return `https://image.tmdb.org/t/p/w${width}${value}`;
  }
  return `assets/images/no_poster_available.jpg`;
}
```
</details>

In the `MovieCardComponent`s template, you can now go ahead and change value for the pipe.
Possible values you can test for the sizes are `300`, `342`, `500`, `780`.

<details>
  <summary>Configure different sizes</summary>

```html
<!--movie-card.component.ts-->

<img class="movie-image" [src]="movie.poster_path | movieImage: 780">

```

</details>
