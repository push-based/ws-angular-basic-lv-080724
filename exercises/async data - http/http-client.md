# Exercise: HttpClient & Observables

In this exercise we get to know the `HttpClient` as well as fire our first `GET` request in order to fetch an actual list of movies. We will
then be able to use real data in our application.

## 0. Setup HttpClient

We need to tell angular to configure the `HttpClient` for us. This is on most cases done at bootstrap time.
Check out the `main.ts` file. You'll notice that the `bootstrapAngularApplication` method takes an `ApplicationConfig` as second
parameter.

Open up the `/src/app/app.config.ts` file and add the `provideHttpClient()` method to the array of `providers`.

<details>
    <summary>setup provideHttpClient()</summary>

```ts
// app.config.ts

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    /* code after */
  ],
};

```

</details>

Well done, it's now time for us to work with the `HttpClient`.

## 1. Lets fetch movies

Now we want to fire our first http request and fetch a list of movies.
As we are maintaining the data in the `AppComponent`, let's first inject ourselves the `HttpClient` to the constructor of the `AppComponent`.

<details>
  <summary>Inject HttpClient</summary>

```ts
// src/app/app.component.ts

import { HttpClient } from '@angular/common/http';

@Component(/**/)
export class AppComponent {

  constructor(private http: HttpClient) {}
}
```

</details>

Use the `HttpClient#get` method in the `constructor` in order to set up the get request.

The url to use will be `${environment.tmbdBaseUrl}/3/movie/popular`

We also need to configure headers in order to communicate with our API

```ts
// tmbdApiReadAccessKey comes from the environment file

{
  headers: {
    Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`
  }
}
```

use the headers as options for network request

```ts
this.httpClient.get(`${environment.tmbdBaseUrl}/3/movie/popular`, {
  headers: {
    Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`
  }
});
```

As the result of the `get` method will be an observable, let's `subscribe` to it.
In the callback of the subscription, we can console.log the result.

```ts
this.httpClient.get(url, options)
    .subscribe(response => {
      console.log(response);
    });
```

<details>
    <summary>full solution</summary>

```ts
// app.component.ts
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';

@Component(/**/)
export class AppComponent {

  constructor(private http: HttpClient) {
    
    const { tmdbBaseUrl, tmdbApiReadAccessKey } = environment;
    
    this.http.get(
      `${ tmdbBaseUrl }/3/movie/popular`,
      {
        headers: {
          Authorization: `Bearer ${ tmdbApiReadAccessKey }`,
        },
      }
    ).subscribe(response => {
      console.log(response);
    });
  }
}
```
</details>

Run the application and watch the dev tools. You should see the movie result printed out in the console.
When inspecting the `Network` tab, you should also see a get request sent to the tmdb api.

## 2. Type the response & use actual type

Let's help ourselves working with the result coming from the http request and use it's actual response type. We can tell the HttpClient how the shape of the
response looks like manually.

As we've seen in the console output, the movie data is stored under the `{ results }` key. The proper type corresponding
to this dataset is `TMDBMovieModel[]`. 

The `TMDBMovieModel` interface is located under `/src/app/shared/models/movie.model.ts`.

Type the response of the get request like the following example:

```ts
import { TMDBMovieModel } from './shared/model/movie.model';

this.http.get<{ results: TMDBMovieModel[] }>
```

If you now inspect the return value of the http call, you'll notice it is properly typed and you can access all properties of it.

## 3. display real values

Now it's time to display what we fetch. Instead of printing out the result, let's set the value of the `movies` signal.

<details>
  <summary>Set signal value</summary>

```ts

const { tmdbBaseUrl, tmdbApiReadAccessKey } = environment;
this.http
  .get<{ results: TMDBMovieModel[] }>(`${tmdbBaseUrl}/3/movie/popular`, {
    headers: {
      Authorization: `Bearer ${tmdbApiReadAccessKey}`,
    },
  })
  .subscribe(response => {
    this.movies.set(response.results);
  });

```

</details>


Well done! You have successfully fired a `GET` request with the `HttpClient`! We are 1 step closer to a fully featured app!

Serve the application and see the result! You should now see a beautiful list of actual movies :).

## 4. Show a loading state

Now that we are loading asynchronous data, we can also run into situations where we have to wait for it to appear. In order to not
only show a blank page to the user.

Let's first create a `computed` for our loading state. The loading computed should return `true` when there are no movies
in the list and `false` when there are.

<details>
  <summary>loading computed</summary>

```ts
// app.component.ts

import { computed } from '@angular/core';

loading = computed(() => {
  return this.movies().length === 0;
});


```

</details>

Great, now we are going to use it in combination with an `@if` to show a `div.loader` and `@else` to show the `movie-list`.

<details>
  <summary>Show loading spinner</summary>

```html
<!-- app.component.ts -->

<!-- code before -->
@if (loading()) {
  <div class="loader"></div>
} @else {
  <movie-list
    [movies]="movies()"
    [favoriteMovieIds]="favoriteMovieIds()"
    (toggleFavorite)="toggleFavorite($event)" />
}
<!-- code after -->
```

</details>

## 5. Throttle your network / use a timeout and test the spinner 

Let's now see if our loading spinner is actually doing what it should (display as long as there are no movies).

You can choose between two options:
* Throttle your connection with the dev tools
* use a `setTimeout` before setting the signal

> [!WARNING]
> Throttling can be a bit cumbersome, as you have to refresh the page and downloading the bundles will be extremely slow as well.

### Option: setTimeout

In order to simulate waiting times from the API we can simply apply a `setTimeout`.

```ts

this.movieService.getMovies('popular').subscribe(data => {
  setTimeout(() => {
    this.movies.set(data.results);
  }, 2500);
});
```

Refresh the page and see if the loading spinner appears for a while until the result is finally there.

... Don't forget to remove that thing afterward!

### Option: Throttling

serve the application and go to the network tab of the chrome dev tools.
Configure network throttling to something very slow (slow/fast 3g).

Refresh the page and see if the loading spinner appears for a while until the result is finally there.
