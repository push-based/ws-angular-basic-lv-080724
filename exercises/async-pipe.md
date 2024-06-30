# Exercise: async pipe

In this exercise you will learn another way to treat asynchronous values, the `AsyncPipe`. 
The `AsyncPipe` is a convenience tool which will automatically handle subscriptions for us.
Instead of manually maintaining subscriptions in our component, you can use the `AsyncPipe` to
subscribe/unsubscribe in the template.

## set up Observable movies$ field

> Convention: Observable values are post-fixed with the `$` sign

Let's start by introducing a variable `movies$` of type `Observable<{ results: MovieModel[] }>` in
our `AppComponent`.

The `movies$` variable should be assigned to the `httpClient#get` method we are currently subscribing.
You can choose to directly assign the value on variable definition or assign it in the `ngOnInit` hook.


```ts
this.movies$ = this.httpClient.get()...
```

Furthermore, you can get rid of the `OnDestroy` interface, the `ngOnDestroy` hook implementation, the 
`private sub: Subscription` and `movies` variable, as we are handling the subscription in the template and have no need for 
them anymore.

## use async pipe

As we have prepared our component it's now time to use the `async` pipe in our template.

Go to `app.component.html` and use the `AsyncPipe` by using `| async` in order
to retrieve the values from the `movies$` observable in the template.

As we need the value twice (input + `ngIf`), please use the `async` pipe twice for now.

<details>
    <summary>show solution</summary>

```html
<!-- app.component.html -->

<movie-list [movies]="(movies$ | async).results"
            *ngIf="(movies$ | async); else: loading"></movie-list>
```

</details>

Run the application and make sure it's showing the movie list.

## async ngIf hack

> ⚠️ warning ⚠️ with this setup in place, we are sending two network requests instead of only one

Open the network tab in your `devtools` and watch out for the network request to the `popular` endpoint. You
will notice it fires twice.

To avoid this, we can make use of the `async ngIf hack`.

```html
*ngIf="(movies$ | async) as movieResponse
```

<details>
    <summary>show solution</summary>

```html
<!-- app.component.html -->

<movie-list
        [movies]="movieResponse.results"
        *ngIf="(movies$ | async) as movieResponse; else: loading"></movie-list>
<ng-template #loading>
    <div class="loader"></div>
</ng-template>
```

</details>

Run the application and check if the second http request is gone.
