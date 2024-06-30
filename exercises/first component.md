# Exercise: create your first component

In this exercise we want to create our first component (ofc leveraging the angular cli).
For this we will first transform our code we created before into a new component.
Afterwards we will make it a re-usable component by introducing `@Input` and `@Output` bindings.

## create MovieCard component

Let's start by using the `ng generate` command to create a `movie-card` component.

<details>
    <summary>generate MovieCardComponent</summary>

```bash
ng generate component movie-card

OR

ng g c movie-card
```

You should now see four files being generated:
* `movie-card.component.html` => template
* `movie-card.component.ts` => component logic
* `movie-card.component.scss` => stylesheet
* `movie-card.component.spec` => test file

</details>

As some parts of the implementation are already done in `AppComponent`, let's extract
everything related to the movie-card into their respective component files.

* `app.component.ts` => `movie-card.component.html` => template
* `app.component.html` => `movie-card.component.ts` => component logic
* `app.component.scss` => `movie-card.component.scss` => stylesheet

You can keep the `movie` variable inside `AppComponent` as we will need it later

<details>
    <summary>Migrate to MovieCardComponent</summary>

move parts from `AppComponent` to the `MovieCardComponent`

```html
<!-- movie-card.component.html -->

<div class="movie-card" >
    <img class="movie-image"
         [src]="'https://image.tmdb.org/t/p/w300' + movie.poster_path">
    <div class="movie-card-content">
        <div class="movie-card-title">
            {{ movie.title }}
        </div>
        <div class="movie-card-rating" (click)="movieRated($event)">
            {{ movie.vote_average }}
        </div>
    </div>
</div>
```

```scss
/* movie-card.component.scss */

.movie-card {
  transition: transform .15s cubic-bezier(.4,0,.2,1) 0s;
  max-width: 300px;
}

.movie-card:hover {
  transform: scale(1.03);
}

.movie-image {
  display: block;
  width: 100%;
  height: auto;
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

```ts
// movie-card.component.ts

@Component({
  selector: 'movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {

  movie;
    
  movieRated(event) {
    console.log(event);
  }
}

```


</details>


### Bonus: Try different Schematics (Optional)

remove the `MovieCardComponent` before you do this:

try different schematics

```bash
ng g c movie-card --inline-style --inline-template --skipTests

# or

ng g c movie-card -s -t --skipTests

ng g c movie-card --skipTests

```

## Input Bindings

Let's make our component accept data from the outside in order to have its data dynamically
assigned by the consumer.

For this, we want to declare our `movie` property as `@Input()` binding inside of `MovieCardComponent`.

<details>
    <summary>@Input() movie</summary>

mark `movie` as `@Input` binding

```ts
// movie-card.component.ts

@Input() movie;

```

</details>


## Output binding

As we also want to inform our consumer in case of the movie rating changed, let's implement an `@Output() ratingChanged` binding
for it.

Create a new public property `ratingChanged: EventEmitter` and mark it as `@Output`. It should
get called whenever the `click` binding was trigger inside of the `MovieCardComponent`

<details>
    <summary>@Output ratingChanged</summary>

```ts
// movie-card.component.ts

@Output() ratingChanged = new EventEmitter();

movieRated(event) {
    this.ratingChanged.emit(event);
}

```

</details>

## use movie-card component

Our `MovieCardComponent` is feature complete for now. Let's finally make use of it in the `AppComponent`

Use `movie-card` inside of `AppComponent`s template, assign `[movie]="movie"` and bind to
the `(ratingChanged)` output.

<details>
    <summary>Use `MovieCardComponent`</summary>

```html
<!-- app.component.html -->

<movie-card [movie]="movie"
            (ratingChanged)="movieRated($event)">
</movie-card>
```

</details>

Serve the application and make sure `movie-card` component is actually rendered in your browser.
If you want, you can create now multiple instances of `movie-card` and see how it affects 
the rendered outcome.

```bash
ng serve

# or

npm run start
```

## introduce proper typings

Let's make our lives as developers easier and introduce typings for our component.

Create a new file `movie.model.ts` with an interface `MovieModel` in `src/app` or use
the cli for this task: `ng g interface movie`.


<details>
    <summary>MovieModel</summary>

```ts
// movie.model.ts

export interface MovieModel {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}
```

</details>

use the interface to type all movie related usages

<details>
    <summary>Use MovieModel</summary>

```ts
// app.component.ts

movie: MovieModel = {
    // ...
}
```

```ts
// movie-card.component.ts

@Input() movie: MovieModel;
```

</details>


Now you can go to the `AppComponent`, remove the `poster_path` property and watch how the IDE notifies you about the error.
try to serve the application with `ng serve`.

restore the application to a working state afterwards

## Make outputs typesafe

go to `AppComponent` & `MovieCardComponent` and type all event bindings with their correct types

<details>
    <summary>Make event bindings typesafe</summary>

```ts
// movie-card.component.ts

@Output() ratingChanged = new EventEmitter<MouseEvent>();

ratingChanged(event: MouseEvent) {
    this.ratingChanged.emit(event);
}
```

```ts
// app.component.ts

movieRated(event: MouseEvent) {
    this.ratingChanged.emit(event);
}
```

</details>

### Bonus: use star-rating in movie-card component

use the `ui-star-rating` component as well in the `MovieCardComponent`

<details>
    <summary>ui-star-rating usage</summary>

```html
<!-- movie-card.component.html -->

<ui-star-rating [rating]="movie.vote_average"
                (click)="movieRated($event)"></ui-star-rating>
```

</details>
