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
    Authorization: `Bearer ${tmdbApiReadAccessKey}`
  }
}
```

use the headers as options for network request

```ts
this.httpClient.get(`${environment.tmbdBaseUrl}/3/movie/popular`, {
  headers: {
    Authorization: `Bearer ${tmdbApiReadAccessKey}`
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


<details>
    <summary>Show Solution</summary>

```ts
// app.component.ts

movies = signal<TMDBMovieModel[]>([]);

constructor(
    private httpClient: HttpClient
) {}

ngOnInit() {
    // destruct environment variables
    const { tmdbBaseUrl, tmdbApiReadAccessKey } = environment;
    this.httpClient.get<{ results: MovieModel[]}>(
        `${tmdbBaseUrl}/3/movie/popular`,
        {
            headers: {
                Authorization: `Bearer ${tmdbApiReadAccessKey}`,
            },
        }
    ).subscribe(response => {
        this.movies.set(response.results);
    });
}
```
</details>

serve the application and see the result! You should now see a beautiful list of movies

## throttle and watch loading spinner

Let's now see if our loading spinner is actually doing what it should (display as long as there are no movies).

You can choose between two options:
* Throttle your connection with the dev tools
* apply a [`delay`](https://rxjs.dev/api/operators/delay) operator to the stream in order to simulate waiting times

> Throttling can be a bit cumbersome, as you have to refresh the page and downloading the bundles will be extremely slow as well.

### Option: delay

In order to simulate waiting times from the API we can simply apply a `delay` operator to the value subscription.

```ts
http.get()
    .pipe( // pipe is needed to use operators
        delay(250) // the delay operator will delay the emission of values for the configured amount of time in ms
    )
```

Refresh the page and see if the loading spinner appears for a while until the result is finally there.

### Option: Throttling

serve the application and go to the network tab of the chrome dev tools.
Configure network throttling to something very slow (slow/fast 3g).

Refresh the page and see if the loading spinner appears for a while until the result is finally there.


Well done! You have successfully fired a `GET` request with the `HttpClient`! We are 1 step closer to a fully
working app :)
