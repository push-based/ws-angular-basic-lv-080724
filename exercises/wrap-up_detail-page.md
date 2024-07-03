# Exercise: Wrap-up - Movie Detail Page

In this exercise we will recap everything we've learned so far by implementing a new feature to the movies application.
We want to enable our users to see detail information about a movie after selecting it from the movie list.

We will recap the following things we've learned so far:
* lazy loaded routing
* router params
* control flow
* http client / service usage
* multiple http calls
* loading state

## 0. Prepare the MovieService

We will need to call multiple different APIs during this exercise. Let's first make sure they are accessible via the `MovieService`
before we start implementing the detail page.

Implement the following methods in the `MovieService` for usage in the upcoming detail page component.

* method to fetch movie by `getMovieById(id: string): Observable<TMDBMovieDetailsModel>`
* method to fetch recommendations `getMovieRecommendations(movieId: string): Observable<{ results: TMDBMovieModel[] }>`
* method to fetch credits `getMovieCredits(movieId: string): Observable<TMDBMovieCreditsModel>`

Information for the byId request:
* [`/movie/${movieId}`](https://developers.themoviedb.org/3/movies/get-movie-details)
* returns `TMDBMovieDetailsModel` (`shared/model/movie-details.model.ts`)

Information for the recommendations request:
* [`/movie/${movieId}/recommendations`](https://developers.themoviedb.org/3/movies/get-movie-recommendations)
* returns `{ results: MovieModel[] }`

Information for the credits request:
* [`/movie/${movieId}/credits`](https://developers.themoviedb.org/3/movies/get-movie-credits)
* returns `{ results: TMDBMovieCreditsModel }` (`shared/model/movie-credits.model.ts`)

<details>
  <summary>MovieService method implementations</summary>

```ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TMDBMovieModel } from '../shared/model/movie.model';
import { TMDBMovieCreditsModel } from '../shared/model/movie-credits.model';
import { TMDBMovieDetailsModel } from '../shared/model/movie-details.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private httpClient = inject(HttpClient);

  getMovieCredits(movieId: string): Observable<TMDBMovieCreditsModel> {
    return this.httpClient.get<TMDBMovieCreditsModel>(
      `${environment.tmdbBaseUrl}/3/movie/${movieId}/credits`
    );
  }

  getMovieRecommendations(
    movieId: string
  ): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/movie/${movieId}/recommendations`
    );
  }

  getMovieById(movieId: string): Observable<TMDBMovieDetailsModel> {
    return this.httpClient.get<TMDBMovieDetailsModel>(
      `${environment.tmdbBaseUrl}/3/movie/${movieId}`
    );
  }

  getMovies(category: string): Observable<{ results: TMDBMovieModel[] }> {
    return this.httpClient.get<{ results: TMDBMovieModel[] }>(
      `${environment.tmdbBaseUrl}/3/movie/${category}`
    );
  }
}


```

</details>

## 1. Generate MovieDetailPageComponent

Generate a component `MovieDetailPageComponent`.

<details>
    <summary> Generate MovieDetailPageComponent </summary>

```bash
ng g c movie/movie-detail-page
```

</details>

Now we can configure our lazy-loaded route in the `app.routing.ts` file.
The route should load the `MovieDetailPageComponent` at the `/movie` route and have a parameter for the `:id`. 

If you don't stick to the solution, you can assign any custom route you want, it doesn't matter. Just be sure to add
a parameter for the id :)

<details>
    <summary> Router Config </summary>

```ts
// app.routing.ts

{
    path: 'movie/:id',
    loadComponent: () => import('./movie/movie-detail-page/movie-detail-page.component')
      .then(m => m.MovieDetailPageComponent)
},

```

</details>

## 1. Implement navigation

We also need a way to navigate to the `MovieDetailPageComponent`.

Consider using the `routerLink` directive on a `movie-card` in the template of `MovieListComponent` for it.

<details>
    <summary> show solution </summary>

```html
// movie-list.component.html

<movie-card
  [routerLink]="['movie', movie.id]"
  *ngFor=""></movie-card>

```

</details>

## Implement MovieDetailPageComponent

Now it's time to implement our actual `MovieDetailPageComponent`.

The pattern is very similar to the one we use `MovieListPageComponent`.
We need to make sure to use the `ActivatedRoute` in order to `subscribe` to the `params`.

With the `id` from our params we now can make the request to the `MovieDetail` and the `MovieRecommendations` endpoints.

make sure to provide two `Observable` values for the template:
* `movie$: Observable<TMBD...>`
* `credits$: Observable<TMDBMovieCreditsModel>`
* `recommendations$: Observable<{ results: MovieModel[] }>`

<details>
    <summary> MovieDetailPageComponent implementation </summary>

```ts
// movie-detail-page.component.ts

movie$: Observable<TMDBMovieDetailsModel>;
credits$: Observable<TMDBMovieCreditsModel>;
recommendations$: Observable<{ results: MovieModel[] }>;

constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
) { }

ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
        if (params.id) {
            this.movie$ = this.movieService.getMovie(params.id);
            this.recommendations$ = this.movieService.getMovieRecommendations(params.id);
            this.credits$ = this.movieService.getMovieCredits(params.id);
        }
    });
}
```

</details>

For everyone who struggles with importing modules, here the complete list of modules to import

<details>
    <summary> show module imports </summary>

```ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailGridModule } from '../../ui/component/detail-grid/detail-grid.module';
import { SvgIconModule } from '../../ui/component/icons/icon.module';
import { StarRatingModule } from '../../ui/pattern/star-rating/star-rating.module';
import { MovieModule } from '../movie.module';

@Component({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DetailGridModule,
        SvgIconModule,
        MovieModule,
        StarRatingModule,
    ],
})
export class MovieDetailPageComponent {}


```
</details>

You don't need to mess around with the styling of the whole component, so please just copy these
styles into the components' stylesheet file.

<details>
    <summary> show styles </summary>

```scss
@import "../../ui/token/mixins/flex";
@import "../../ui/component/aspect-ratio/aspect-ratio";

:host {
  width: 100%;
  display: block;
}

.loader {
  position: absolute;
  z-index: 200;
  top: 250px;
}

.movie-detail-wrapper {
  min-height: 500px;
}

.movie-detail {

  @media only screen and (max-width: 1500px) {
    &--grid-item {
      padding: 3rem;
    }
  }

  &--genres {
    @include d-flex-v;
    flex-wrap: wrap;

    &-link {
      &:not(:last-child) {
        margin-right: 2rem;
      }

      @include d-flex-v;
      padding: 0.5rem 0;
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  &--ad-section-links {
    .section--content {
      @include d-flex;
      margin-right: auto;
    }

    .btn {
      margin-right: 2rem;
      @media only screen and (max-width: 1300px) {
        margin-right: 1rem;
      }
    }

    > .btn:last-child {
      margin-right: 0rem;
      float: right;
    }
  }

  &--basic-infos {
    @include d-flex-v;
    justify-content: space-between;
  }

  &--cast-list {
    @include d-flex;
    flex-direction: row;
    margin: 0 20px;
    width: 100%;
    height: 50px;
    contain: strict;
    overflow: hidden;
  }
}

.cast-list {
  width: 100%;
  display: flex;
  overflow-x: scroll;
  position: relative;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.cast-list--btn {
  background: transparent;
  border: 0;
  z-index: 2;
  font-size: 40px;
  text-decoration: none;
  cursor: pointer;
  color: rgb(102, 102, 102);
}

.movie-detail--languages-runtime-release {
  color: var(--palette-warning-main);
  text-transform: uppercase;
}

.movie-detail--section {
  margin-bottom: 3rem;
}

.movie-detail--cast-actor {
  display: block;
  height: auto;
  width: 70px;
  flex-shrink: 0;

  img {
    display: block;
    width: 44px;
    height: 44px;
    border-radius: var(--theme-borderRadius-circle);
    object-fit: cover;
    margin: 0 auto;
  }
}

```
</details>

Now we should be ready to go to implement our template.

As a basis I will provide you a raw skeleton with everything you need to apply all the needed view bindings yourself.

<details>
    <summary> show template </summary>

```html
<div class="movie-detail-wrapper">
  <!-- use movie$ -->
  <!-- show loader when there is no movie -->
  <ui-detail-grid>
    <div detailGridMedia>
      <!-- img w780, h1170 class="aspectRatio-2-3 fit-cover" -->

    </div>
    <div detailGridDescription>
      <header>
        <!-- h1 title -->
        <!-- h2 tagline -->
      </header>
      <section class="movie-detail--basic-infos">
        <!-- ui-star-rating -->
        <!-- vote_average -->
        <div class="movie-detail--languages-runtime-release">
            <strong>
                <!-- spoken_languages[0]?.english_name --> /
                <!-- runtime --> /
                <!-- release_date | date: 'Y' -->
            </strong>
        </div>
      </section>
      <section>
        <h3>The Genres</h3>
        <div class="movie-detail--genres">
          <!-- a class="movie-detail--genres-link" *ngFor="genres" -->
            <a class="movie-detail--genres-link">
                <svg-icon name="genre"></svg-icon>
            </a>
        </div>
      </section>
      <section>
        <h3>The Synopsis</h3>
        <!-- p overview || 'not available text' -->
      </section>
      <section>
        <h3>The Cast</h3>
        <div class="movie-detail--cast-list">
          <div class="cast-list">
            <!-- credits$ -->
            <!-- class="movie-detail--cast-actor" -->
            <!-- <img
                loading="lazy"
                [src]="
                  c?.profile_path
                    ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
                    : 'assets/images/no_poster_available.jpg'
                "
                [alt]="c.name"
                [title]="c.name"
              />
              -->
          </div>
        </div>
      </section>
      <section class="movie-detail--ad-section-links">
        <!-- homepage -->
        <a
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
          <svg-icon class="btn__icon" name="website"></svg-icon>

        </a>
        <!-- (ngIf) ? imdb_id -->
        <a
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
          [href]="'https://www.imdb.com/title/'"
        >
          IMDB
          <svg-icon class="btn__icon" name="imdb"></svg-icon>
        </a>
        <!-- TODO: create dialog with iframe embed -->
        <!-- back function -->
        <button class="btn primary-button">
          <svg-icon class="btn__icon" name="back" size="1em"></svg-icon>&nbsp;Back
        </button>
      </section>
    </div>
  </ui-detail-grid>
</div>
<div>
  <header>
    <h1>Recommended</h1>
    <h2>Movies</h2>
  </header>

  <!-- recommendations$ movie list with loader -->

<!--  <movie-list></movie-list>-->

</div>

```

</details>

If you have struggles with the implementation, here is the complete solution:

<details>
    <summary> show full solution </summary>
    
```ts
// movie-detail-page.component.ts

recommendations$: Observable<{ results: MovieModel[] }>;
credits$: Observable<TMDBMovieCreditsModel>;
movie$: Observable<TMDBMovieDetailsModel>;

constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
) {}

ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
        this.movie$ = this.movieService.getMovieById(params.id);
        this.credits$ = this.movieService.getMovieCredits(params.id);
        this.recommendations$ = this.movieService.getMovieRecommendations(
            params.id
        );
    });
}
```

```html

<div class="movie-detail-wrapper">
  <ui-detail-grid *ngIf="(movie$ | async) as movie; else: loader">
    <div detailGridMedia>
      <img class="aspectRatio-2-3 fit-cover"
           [src]="movie.poster_path | movieImage"
           [alt]="movie.title"
           width="780px"
           height="1170px">
    </div>
    <div detailGridDescription>
      <header>
        <h1>{{ movie.title }}</h1>
        <h2>{{ movie.tagline }}</h2>
      </header>
      <section class="movie-detail--basic-infos">
        <ui-star-rating
          [rating]="movie.vote_average"
          [showRating]="true"
        ></ui-star-rating>
        <div class="movie-detail--languages-runtime-release">
          <strong>
            {{ movie.spoken_languages[0]?.english_name }} /
            {{ movie.runtime }} min /
            {{ movie.release_date | date: 'Y' }}
          </strong>
        </div>
      </section>
      <section>
        <h3>The Genres</h3>
        <div class="movie-detail--genres">
          <!-- class="movie-detail--genres-link" genre links -->
          <a class="movie-detail--genres-link"
               *ngFor="let genre of movie.genres">
            <svg-icon name="genre"></svg-icon>
            {{ genre.name }}
          </a>
        </div>
      </section>
      <section>
        <h3>The Synopsis</h3>
        <p>{{ movie.overview || 'Sorry, no overview available' }}</p>
      </section>
      <section>
        <h3>The Cast</h3>
        <div class="movie-detail--cast-list">
          <div class="cast-list"
               *ngIf="(credits$ | async) as credits">
            <div class="movie-detail--cast-actor"
                 *ngFor="let actor of credits.cast">
              <img
                loading="lazy"
                [src]="
                  actor?.profile_path
                    ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path
                    : 'assets/images/no_poster_available.jpg'
                "
                [alt]="actor.name"
                [title]="actor.name"
              />
            </div>
            <!-- class="movie-detail--cast-actor" -->
            <!-- <img
                loading="lazy"
                [src]="
                  c?.profile_path
                    ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
                    : 'assets/images/no_poster_available.jpg'
                "
                [alt]="c.name"
                [title]="c.name"
              />
              -->
          </div>
        </div>
      </section>
      <section class="movie-detail--ad-section-links">
        <!-- homepage -->
        <a
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
          <svg-icon class="btn__icon" name="website"></svg-icon>

        </a>
        <!-- (ngIf) ? imdb_id -->
        <a
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
          [href]="'https://www.imdb.com/title/'"
        >
          IMDB
          <svg-icon class="btn__icon" name="imdb"></svg-icon>
        </a>
        <!-- (ngIf) ? imdb_id -->
        <a
          class="btn"
        >
          Trailer
          <svg-icon class="btn__icon" name="play"></svg-icon>
        </a>
        <!-- TODO: create dialog with iframe embed -->
        <!-- back function -->
        <button class="btn primary-button">
          <svg-icon class="btn__icon" name="back" size="1em"></svg-icon>&nbsp;Back
        </button>
      </section>
    </div>
  </ui-detail-grid>
</div>
<div>
  <header>
    <h1>Recommended</h1>
    <h2>Movies</h2>
  </header>
  <ng-container *ngIf="(recommendations$ | async) as recommendations; else: loader">

    <movie-list
      [movies]="recommendations.results"
      *ngIf="recommendations.results.length > 0; else: noResult">
    </movie-list>

    <ng-template #noResult>
      <div>No recommended movies</div>
    </ng-template>

  </ng-container>

  <ng-template #loader>
    <div class="loader"></div>
  </ng-template>

</div>


```
</details>



