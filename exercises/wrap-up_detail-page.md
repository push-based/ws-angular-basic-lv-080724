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

  /* other methods */
  
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
  
}


```

</details>

## 1. Generate MovieDetailPageComponent

Generate a component `MovieDetailPageComponent`, you might want to use `--inlineStyle=false` this time.

<details>
    <summary> Generate MovieDetailPageComponent </summary>

```bash
ng g c movie/movie-detail-page --inlineStyle=false
```

</details>

You don't need to mess around with the styling of the whole component, so please just copy these
styles into the components' stylesheet file.

<details>
    <summary> movie-detail-page.component.scss </summary>

```scss
@import "../../ui/token/mixins/flex";
@import "../../ui/component/aspect-ratio/aspect-ratio";

:host {
  width: 100%;
  display: block;
}

.movie-detail-wrapper {
  min-height: 500px;
  .loader {
    position: absolute;
    z-index: 200;
    top: 250px;
  }
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

## 2. Configure Router

Now we can configure our lazy-loaded route in the `app.routes.ts` file.
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

We also need a way to navigate to the `MovieDetailPageComponent`.

## 3. Implement Navigation

Consider using the `routerLink` directive on a `movie-card` in the template of `MovieListComponent` for it.

<details>
    <summary> apply routerLink to `movie-card` </summary>

```html
// movie-list.component.ts

@for (movie of movies(); track movie.id) {
  <movie-card
    [routerLink]="['/movie', movie.id]"
    [movie]="movie"
    [favorite]="favoriteMovieIds().has(movie.id)"
    (favoriteChange)="toggleFavorite.emit(movie)" />
}

```

</details>

You can already try to navigate to the movie detail page.

## 4. Implement MovieDetailPageComponent

Now it's time to implement our actual `MovieDetailPageComponent`.

The pattern is very similar to the one we use `MovieListPageComponent`.
We need to make sure to use the `ActivatedRoute` in order to `subscribe` to the `params`.

### 4.1 Fetch data from API

With the `id` from our params we now can make the request to the `getMovieById`, `getMovieRecommendations` and the `getMovieCredits` endpoints.

make sure to create three `Signal` values for the template:
* `movie: Signal<TMBDMovieModel | null>` -> we need to type as `| null` otherwise we can't provide an initial value
* `credits: Signal<TMDBMovieCreditsModel | null>` -> we need to type as `| null` otherwise we can't provide an initial value
* `recommendations: Signal<TMBDMovieModel[] | null>` -> we need to type as `| null` as we want to differentiate between loading & empty

Also don't forget to reset the signals on param changes.

<details>
    <summary> MovieDetailPageComponent Skeleton </summary>

```ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { TMDBMovieCreditsModel } from '../../shared/model/movie-credits.model';
import { TMDBMovieDetailsModel } from '../../shared/model/movie-details.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'movie-detail-page',
  standalone: true,
  imports: [],
  template: ` <p>movie-detail-page works!</p> `,
  styleUrls: ['./movie-detail-page.component.scss'],
})
export class MovieDetailPageComponent {
  route = inject(ActivatedRoute);
  movieService = inject(MovieService);

  movie = signal<TMDBMovieDetailsModel | null>(null);
  credits = signal<TMDBMovieCreditsModel | null>(null);
  recommendations = signal<TMDBMovieModel[] | null>(null);

  constructor() {
    this.route.params.subscribe(params => {
      // value resets!
      this.movie.set(null);
      this.credits.set(null);
      this.recommendations.set(null);
      /* service calls go here */
    });
  }
}
```

</details>


<details>
  <summary>MovieDetailPage API Calls</summary>

```ts

// API calls:
if (params.id) {
  this.movieService.getMovieById(params.id).subscribe(movie => {
    this.movie.set(movie);
  });
  this.movieService
    .getMovieRecommendations(params.id)
    .subscribe(({ results }) => {
      this.recommendations.set(results);
    });
  this.movieService.getMovieCredits(params.id).subscribe(credits => {
    this.credits.set(credits);
  });
}

```

</details>

### 4.2 Template Bindings

Now we should be ready to go to implement our template.

As a basis I will provide you a raw skeleton with everything you need to apply all the needed view bindings yourself.

<details>
    <summary> MovieDetailPage Template Skeleton </summary>

```html
<div class="movie-detail-wrapper">
  <!-- use movie() -->
  <!-- @if (movie()) { ui-detail-grid } @else { div.loader }-->
  <ui-detail-grid>
    <div detailGridMedia>
      <!--
        [src]="movie: poster_path | movieImage: 780"
        [alt]="movie: title"
      -->
      <img class="aspectRatio-2-3 fit-cover" width="780" height="1170" />
    </div>
    <div detailGridDescription class="movie-detail">
      <header>
        <h1><!-- movie: title --></h1>
        <h2><!-- movie: tagline --></h2>
      </header>
      <section class="movie-detail--basic-infos">
        <!-- ui-star-rating [rating]="movie: vote_average" -->
        <div class="movie-detail--languages-runtime-release">
          <strong>
            <!-- movie: spoken_languages[0]?.english_name -->
            /
            <!-- movie: runtime -->
            /
            <!-- movie: release_date | date: 'Y' -->
          </strong>
        </div>
      </section>
      <section>
        <h3>The Genres</h3>
        <div class="movie-detail--genres">
          <!-- @for (genre .... ) {  } -->
          <!-- <a class="movie-detail--genres-link" [routerLink]="['/genre', genre.id]">
            <fast-svg name="genre" />
            {{ genre.name }}
          <a/> -->
        </div>
      </section>
      <section>
        <h3>The Synopsis</h3>
        <p><!-- movie: overview || 'No overview available' --></p>
      </section>
      <section>
        <h3>The Cast</h3>
        <div class="movie-detail--cast-list">
          <div class="cast-list">
            <!-- @for (actor of credits().cast ...) {} -->
            <!-- div class="movie-detail--cast-actor" -->
            <!-- <img
                loading="lazy"
                [src]="actor.profile_path | movieImage: 185"
                [alt]="actor.name"
                [title]="actor.name"
              />
              -->
          </div>
        </div>
      </section>
      <section class="movie-detail--ad-section-links">
        <div class="section--content">
          <!-- @if (movie: homepage) {} -->
          <!--<a
            class="btn"
            [href]="movie: homepage"
            target="_blank"
            rel="noopener noreferrer">
            Website
            <fast-svg class="btn__icon" name="website" />
          </a>-->
          <!-- @if (movie().imdb_id) {} -->
          <!--<a
            class="btn"
            target="_blank"
            rel="noopener noreferrer"
            [href]="'https://www.imdb.com/title/' + movie: imdb_id">
            IMDB
            <fast-svg class="btn__icon" name="imdb" />
          </a>-->
          <!-- back function -->
          <button class="btn primary-button">
            <fast-svg class="btn__icon" name="back" size="1em" />&nbsp;Back
          </button>
        </div>
        
      </section>
    </div>
  </ui-detail-grid>
</div>
<div>
  <header>
    <h1>Recommended</h1>
    <h2>Movies</h2>
  </header>
  <!-- @if (recommendations()) { <movie-list /> } @else { div.loader }-->
</div>

```

</details>

## Full Solution

<details>
  <summary>MovieDetailPageComponent</summary>

```ts

import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { TMDBMovieCreditsModel } from '../../shared/model/movie-credits.model';
import { TMDBMovieDetailsModel } from '../../shared/model/movie-details.model';
import { DetailGridComponent } from '../../ui/component/detail-grid/detail-grid.component';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';
import { MovieService } from '../movie.service';
import { MovieImagePipe } from '../movie-image.pipe';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'movie-detail-page',
  standalone: true,
  imports: [
    DetailGridComponent,
    MovieImagePipe,
    StarRatingComponent,
    FastSvgComponent,
    MovieListComponent,
    DatePipe,
    RouterLink,
  ],
  template: `
    <div class="movie-detail-wrapper">
      @if (movie()) {
        <ui-detail-grid>
          <div detailGridMedia>
            <img
              class="aspectRatio-2-3 fit-cover"
              [src]="movie().poster_path | movieImage: 780"
              [alt]="movie().title"
              width="780"
              height="1170" />
          </div>
          <div detailGridDescription class="movie-detail">
            <header>
              <h1>{{ movie().title }}</h1>
              <h2>{{ movie().tagline }}</h2>
            </header>
            <section class="movie-detail--basic-infos">
              <ui-star-rating [rating]="movie().vote_average" />
              <div class="movie-detail--languages-runtime-release">
                <strong>
                  {{ movie().spoken_languages[0]?.english_name }}
                  /
                  {{ movie().runtime }}
                  /
                  {{ movie().release_date | date: 'Y' }}
                </strong>
              </div>
            </section>
            <section>
              <h3>The Genres</h3>
              <div class="movie-detail--genres">
                @for (genre of movie().genres; track genre.id) {
                  <a
                    class="movie-detail--genres-link"
                    [routerLink]="['/genre', genre.id]">
                    <fast-svg name="genre" />
                    {{ genre.name }}
                  </a>
                }
              </div>
            </section>
            <section>
              <h3>The Synopsis</h3>
              <p>{{ movie().overview || 'no overview available' }}</p>
            </section>
            <section>
              <h3>The Cast</h3>
              <div class="movie-detail--cast-list">
                <div class="cast-list">
                  @for (actor of credits().cast; track actor.id) {
                    <div class="movie-detail--cast-actor">
                      <img
                        loading="lazy"
                        [src]="actor.profile_path | movieImage: 185"
                        [alt]="actor.name"
                        [title]="actor.name" />
                    </div>
                  }
                </div>
              </div>
            </section>
            <section class="movie-detail--ad-section-links">
              <div class="section--content">
                @if (movie().homepage) {
                  <a
                    class="btn"
                    [href]="movie().homepage"
                    target="_blank"
                    rel="noopener noreferrer">
                    Website
                    <fast-svg class="btn__icon" name="website" />
                  </a>
                }
                @if (movie().imdb_id) {
                  <a
                    class="btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    [href]="'https://www.imdb.com/title/' + movie().imdb_id">
                    IMDB
                    <fast-svg class="btn__icon" name="imdb" />
                  </a>
                }
                <!-- back function -->
                <button class="btn primary-button">
                  <fast-svg
                    class="btn__icon"
                    name="back"
                    size="1em" />&nbsp;Back
                </button>
              </div>
            </section>
          </div>
        </ui-detail-grid>
      } @else {
        <div class="loader"></div>
      }
    </div>
    <div>
      <header>
        <h1>Recommended</h1>
        <h2>Movies</h2>
      </header>
      @if (recommendations()) {
        <movie-list [movies]="recommendations()" />
      } @else {
        <div class="loader"></div>
      }
    </div>
  `,
  styleUrls: ['./movie-detail-page.component.scss'],
})
export class MovieDetailPageComponent {
  route = inject(ActivatedRoute);
  movieService = inject(MovieService);

  movie = signal<TMDBMovieDetailsModel | null>(null);
  credits = signal<TMDBMovieCreditsModel | null>(null);
  recommendations = signal<TMDBMovieModel[] | null>(null);

  constructor() {
    this.route.params.subscribe(params => {
      this.movie.set(null);
      this.credits.set(null);
      this.recommendations.set(null);
      if (params.id) {
        this.movieService.getMovieById(params.id).subscribe(movie => {
          this.movie.set(movie);
        });
        this.movieService
          .getMovieRecommendations(params.id)
          .subscribe(({ results }) => {
            this.recommendations.set(results);
          });
        this.movieService.getMovieCredits(params.id).subscribe(credits => {
          this.credits.set(credits);
        });
      }
    });
  }
}


```

</details>
