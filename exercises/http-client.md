# Exercise: HttpClient & Observables

In this exercise we get to know the `HttpClient` as well as fire our first `GET` request in order to fetch a list of `Movies`. We will
then be able to use real data in our application.

## setup modules

import `HttpClientModule` into `AppModule` and inject `HttpClient` into `AppComponent`s constructor

<details>
    <summary>Module & Component Setup</summary>

```ts
// app.module.ts

@NgModule({
    imports: [HttpClientModule]
})
export class AppModule {}
```

```ts
// app.component.ts

export class AppComponent {

    constructor(
        private httpClient: HttpClient
    ) {}
}
```
</details>

## first http network request

Use the `HttpClient` in the `ngOnInit` lifecycle hook in order to set up the get request.

The url to use will be `${environment.tmbdBaseUrl}/3/movie/popular`

```ts
this.httpClient.get(url, options);
```

We also need to configure headers in order to communicate with our API

```ts
// tmbdApiReadAccessKey comes from environment as well

headers: {
    Authorization: `Bearer ${tmdbApiReadAccessKey}`
}
```

use the headers as options for network request

now `subscribe` to the request and log the output

```ts
this.httpClient.get(url, options)
    .subscribe(console.log);
```

<details>
    <summary>full solution</summary>

```ts
// app.component.ts

constructor(
    private httpClient: HttpClient
) {
}

ngOnInit() {
    // destruct environment variables
    const { tmdbBaseUrl, tmdbApiReadAccessKey } = environment;
    this.httpClient.get(
        `${tmdbBaseUrl}/3/movie/popular`,
        {
            headers: {
                Authorization: `Bearer ${tmdbApiReadAccessKey}`,
            },
        }
    ).subscribe(console.log);
}
```
</details>

run the application and watch the dev tools. You should see the movie result printed out in the console.

## don't forget to unsubscribe!!!

store the `subscription` into a private field in the `AppComponent`

```ts
private readonly sub = new Subscription();
```

add the `subscription` to the local `sub` when you set it up

```ts
ngOnInit() {
    
    this.sub.add(
        this.http.get()...
    )
}
```

implement the `OnDestroy` interface and make sure to `unsubscribe` from the `subscription`

```ts
implements OnDestroy
```

```ts

ngOnDestroy() {
    this.sub.unsubscribe();
}
```


## display real values

Now it's time to display what we fetch.
Store the fetched movies as local variable and use it in the template.

Instead of calling `console.log` in the `subscribe` method we want to actually set our `movie: MovieModel[]` field to
the new value coming as response from the request.

if you have already inspected the outcome of the request, you may have noticed the result is something like:

```ts
{ results: MovieModel[], /* other properties */ }
```

Let's type our get request and properly react to the subscription value

```ts
this.httpClient.get<{ results: MovieModel[]}>()
    .subscribe(response => {
        this.movies = response.results;
    })

// or with object destructing

this.httpClient.get<{ results: MovieModel[]}>()
    .subscribe(({ results }) => {
        this.movies = results;
    })
```


<details>
    <summary>Show Solution</summary>

```ts
// app.component.ts

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
        this.movies = response.results;
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
