# Exercise: Router setup

In this exercise you will learn the basics of angulars routing system.
The goal of this exercise is to create your first set of components which are accessible
via the router. You will implement a dedicated component to display the current list of movies
as well as provide a 404 page in case a wrong address was entered.

For this you will introduce a new `MoviePageComponent` which will handle the routing
and the display the current movies for you.

You will continue creating a root level `RoutingModule` to configure our Router and manage redirects for you.

In the end you will have accomplished the following goals:

* default route to `list/popular`
* not found page (with `NotFoundPageComponent`)

## Create movie-list-page component

Let's start by introducing a dedicated, routable component. 
Introduce a new `MovieListPageComponent`, either as `SCAM` or `standalone` component.

If you've chosen to use a Module:

The `MovieListPageModule` does not need to export the `MovieListPageComponent`, we plan to
only configure a route to it. You also need to import `RouterModule.forChild()` and configure
an empty path route to the `MovieListPageComponent`.

<details>
    <summary>generate component</summary>

```bash
# generate component
ng g c movie/movie-list-page --standalone
```

</details>

The `MovieListPageComponent` in its first state should just do what the `AppComponent`
did before.

Please move (just the code, don't delete any component pls!!) everything related to movie-list
including the data-fetching from `AppComponent` to `MovieListPageComponent`.

Also remove the import to `MovieModule` in `AppModule`.

<details>
    <summary>MovieListPageComponent implementation</summary>

```ts
// movie-list-page.component.ts
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  /** **/,
  standalone: true
})
export class MovieListPageComponent {
  movies$: Observable<{ results: MovieModel[]}>;
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  ngOnInit() {
    // destruct variables
    const { tmdbBaseUrl, tmdbApiReadAccessKey } = environment;
    this.movies$ = this.httpClient.get<{ results: MovieModel[]}>(
      `${tmdbBaseUrl}/3/movie/popular`,
      {
        headers: {
          Authorization: `Bearer ${tmdbApiReadAccessKey}`,
        },
      }
    );
  }
}

```

```html
<!-- movie-list-page.component.html -->

<movie-list
  [movies]="movieResponse.results"
  *ngIf="(movies$ | async) as movieResponse; else: loading"></movie-list>
<ng-template #loading>
  <div class="loader"></div>
</ng-template>

```

</details>

## Setup AppRouting module

Now that we have a component dedicated for our router to work with, all what's left is to configure
the router.

Create an `AppRoutingModule` next to `AppModule` (`--flat`)

<details>
    <summary>generate AppRoutingModule</summary>

```bash
# flat means that we don't want to create a dedicated folder for it

ng g m app-routing --flat
```
</details>

Create a `const routes: Routes` and configure two routes.

* `list/popular` to `MovieListPageComponent`
* `''` redirecting to `list/popular`

in the `AppRoutingModule` you need to import the `RouterModule.forRoot()` modules and pass the `routes`
const as arguments to it.

It is very convenient to add the `RouterModule` not only to the `imports` section, but as well to the `exports`.

<details>
    <summary>AppRoutingModule implementation</summary>

```ts
// app-routing.module.ts
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'list/popular',
        component: MovieListPageComponent
    },
    {
        path: '',
        redirectTo: '/list/popular',
        pathMatch: 'full',
    },
];

// NgModule definition
imports: [
    RouterModule.forRoot(routes)
],
exports: [RouterModule] // for convenience only
```

Don't forget to import the `AppRoutingModule` into the `AppModule`

```ts
// app.module.ts

imports: [AppRoutingModule]

```
</details>

Now we should tell our application where to render the outcome of the router.
Go ahead and add a `router-outlet` to the `AppComponent`'s template. This will tell the router to load the configured component
into the outlet if the path matches.

<details>
    <summary>use RouterOutlet</summary>

```html
<!-- app.component.html -->

<app-shell>
    <router-outlet></router-outlet>
</app-shell>
```

</details>

You can also remove any typescript code from the `AppComponent`, it's just an empty class now!

Serve the application. The router should navigate you automatically to `list/popular` if you try to navigate to `/`,
you should see movie-list-page being rendered now.

An invalid route though should end up in an error, we will fix that in the next step :).

## 404 page

Please try to enter any invalid route into the address-bar of your browser (e.g. `list/populardawdaw`), you will see the application navigates back to the default
route and throw an error in the console.

`Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'list/populardawdaw'`

Let's build a **beautiful** 404 page in case of a user entering an invalid url

Create a new `NotFoundPageComponent`. Create it either as `SCAM` or `standalone` component.

If you create it as `SCAM`, you don't need to export it, though. We only plan to configure a
route for it.

It does not need any typescript logic whatsoever but just should have a template showing the
user that this page is invalid and giving him a link back to a valid site.

In the end you should make sure that the new `NotFoundPageComponent` is configured to be shown as
wildcard (`**`) route.

<details>
  <summary>Generate NotFoundPageComponent</summary>

```bash
ng g c not-found-page --standalone
```

</details>

<details>
    <summary>NotFoundPageComponent implementation</summary>

```ts
import { Component } from '@angular/core';

@Component({
  imports: [SvgIconModule],
  standalone: true
})
export class NotFoundPageComponent {}
```

```html
<!-- not-found-page.component.html -->

<div class="not-found-container">
    <svg-icon size="350px" name="error"></svg-icon>
    <h1 class="title">Sorry, page not found</h1>
    <a class="btn" routerLink="/list/popular">See popular</a>
</div>
```

```scss
/* not-found.component.scss */

:host {
  width: 100%;
  height: 100%;
  display: block;
}

.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.title {
  text-align: center;
  font-size: 4rem;
  font-weight: 700;
  margin: 3rem 1rem;
}
```
</details>

After you've implemented the `NotFoundPageComponent`, the only thing left is to configure it to be shown as
wildcard (`**`) route.

For this, adjust the `AppRoutingModule` with the new router config and add the `NotFoundPageComponent` to the `imports` section
of the `AppModule`.

<details>
    <summary>Router Configuration</summary>

```ts
// app-routing.module.ts
import { RouterModule, Routes } from '@angular/router';

RouterModule.forRoot([
    // other configuration
    {
        path: '**',
        component: NotFoundPageComponent
    }
])
```

important: we need to import the module in the app.module for now

```ts
// app.module.ts

imports: [
    /** other imports **/,
    NotFoundPageComponent
]
```

</details>

Well done! Serve the application and again try enter an invalid url. The application now should display the 404 page component instead.
Congratulations, you have successfully implemented a basic router setup for your application :).
