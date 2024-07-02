# Exercise: Router Lazyloading

In this exercise you will learn a simple technique to speed up the loading time of your application.

Until now, we have a working router configuration which enables our users to display different set
of movies as well as give information about not existing pages.

However, our application is eagerly loading all components within a single `main.js` file. Regardless
of the component being displayed, the user has to download and evaluate every other existing component
as well.

Luckily, angular provides a very simple mechanic to improve this situation and letting users only download
what they really need.

The goal is lazily load the following components in our application:
* `MovieListPageComponent`
* `NotFoundPageComponent`

## Enable LazyLoading

We want to lazyload our `MovieListPageComponent` as well as the `NotFoundPageComponent`.

If you have implemented the mentioned components as `standalone` components, you will have a very easy time
to implement lazyloading.

If you have chosen the `SCAM` approach, you will need to transform the `SCAM`s into `RoutedModule`s.

<details>
  <summary>SCAM Path</summary>

For this, please add a `const routes: Routes` to both lazyloaded modules.
The configuration should point the path `''` to the respective component you want to lazyload.

```ts
// not-found-page.module.ts
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: NotFoundPageComponent
    }
]
```

```ts
// movie-list-page.module.ts
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: MovieListPageComponent
    }
]
```

</details>

Now that the feature modules are configured for proper lazyloading, we now can add the missing bits to the `AppModule`s
root configuration.

```ts
// replace existing routes for notfound page and movie-list with this setup

{
    path: 'path/',
    loadComponent: () => import('path/to/component').then(m => m.ComponentToLazyLoad),
   // or with modules
    loadChildren: () => import('path/to/module').then(m => m.ModuleToLazyLoad)
},

```

> Don't forget to remove the imports to `MovieListPageComponent` and `NotFoundPageComponent` in the `AppModule`

<details>
    <summary>show solution</summary>

```ts
// app-routing.module.ts

const routes: Routes = [
    {
        path: 'list/:category',
        loadComponent: () => {
            return import('./movie/movie-list-page/movie-list-page.component').then(
                (m) => m.MovieListPageComponent
            );
        },
    },
    {
        path: '',
        redirectTo: 'list/popular',
        pathMatch: 'full',
    },
    {
        path: '**',
        loadComponent: () => {
            return import('./not-found-page/not-found-page.component').then(
                (m) => m.NotFoundPageComponent
            );
        },
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

```

</details>

serve the application, you should notice that the bundler now produces two new bundles which resemble the lazyloaded pieces of code
we have configured with our new router configuration.

```shell
Lazy Chunk Files                                                                 | Names         |      Size
projects_movies_src_app_movie_movie-list-page_movie-list-page_module_ts.js       | -             |   6.95 kB
projects_movies_src_app_not-found_not-found_module_ts.js                         | -             |   6.06 kB
```

Congratulations, you have successfully improved your application by lazyloading components
on a router level.

## Bonus: Display Genres (a bit advanced)

The goal of the bonus exercise is to add a new set of routes, enabling users to not only navigate to `/list/${category}`, but also to
`/genre/${id}`.

This requires you to do the following steps:
* fetch the list of genres in the `AppShellComponent` in order to display a set of navigation links
* implement a new `MovieGenrePageComponent` which should be accessible under `genre/:id`
  * it should be able to handle the router params and fetch the according list of movies based on the given id
  * you can safely copy/paste the template of `MovieListPageComponent`

### Implement genre navigation

You will need to show the genre navigation list.
The template for it is already in place, so you just have to comment it in, it lives in the
`AppShellComponent`.

The missing piece is the `genre$: Observable`.
The genre list will be fetched from the tmdb api as well.

You will need to set up an HTTP call in the `AppShellComponent` for it.

Consider using the `TMDBMovieGenreModel` interface for typings which lives in `shared/model/...`

To fetch the genres, use the endpoint [`/3/genre/movie/list`](https://developers.themoviedb.org/3/genres/get-movie-list).

Information for the genres request:
* [`/genre/movie/list`](https://developers.themoviedb.org/3/movies/get-movie-credits)
* returns `{ genres: TMDBMovieGenreModel[] }` (`shared/model/movie-genre.model.ts`)

<details>
  <summary>getGenres method</summary>

```ts
// app-shell.component.ts

genres$: Observable<{ genres: TMDBGenreModel[] }>;
  
constructor(
  private http: HttpClient
) {
  this.genres$ = this.getGenres();
}
  
getGenres(): Observable<{ genres: TMDBGenreModel[] }> {
  return this.http.get<{ genres: TMDBGenreModel[] }>(
    `${tmdbBaseUrl}/genre/movie/list`,
    {
      headers: {
        Authorization: `Bearer ${tmdbApiReadAccessKey}`,
      },
    }
  );
}

```

</details>

If you have the observable in place, you should now get a list of genres as a navigation list.
  
Bind the genre observable with the `async` pipe in the `AppShellComponent` template and iterate with `ngFor`
in order to create a `a.navigation--link` for each genre of the array.
  
<details>
  <summary>render genre list</summary>
  
```html
  <a
    *ngFor="let genre of (genres$ | async)?.genres;"
    class="navigation--link"
    [routerLink]="['/list', 'genre', genre.id]"
    routerLinkActive="active"
  >
    <div class="navigation--menu-item">
      <svg-icon class="navigation--menu-item-icon" name="genre"></svg-icon>
      {{ genre.name }}
    </div>
  </a>
```

</details>
  
  
You maybe need to adjust the `routerLink` directives parameter to point to the route you have configured for
`MovieGenrePageComponent`.

### implement `MovieGenrePageComponent`

Implement a `MovieGenrePageComponent`, it should be accessible under the route `genre/:id`.
  
<details>
  <summary> Router Configuration for MovieGenrePageComponent </summary>
  
```ts
  // app-routing.module.ts
  
  {
    path: 'list/genre/:id',
    loadComponent: () =>
      import('./movie/movie-genre-page/movie-genre-page.component').then(
        (m) => m.MovieGenrePageComponent
      ),
  },
```
</details>

The component itself should be quite similar to `MovieListPageComponent`, but uses a different 
endpoint and router params for getting data.

you will need to send the request to `/3/discover/movie` and add `with_genres` as query parameter.

Information for the movies by genre request:
* [`/discover/movie?with_genres`](https://developers.themoviedb.org/3/discover/movie-discover)
* returns `{ results: MovieModel[] }`
* use `params: { with_genres: genre }` to send the queryparams

<details>
  <summary> MovieListGenrePage implementation </summary>

```ts
  
  movies$: Observable<{ results: MovieModel[] }>;
  
  constructor(private http: HttpClient) {
    this.activatedRoute.params.subscribe((params) => {
      const genreId = params['id'];
      this.movies$ = this.getMoviesByGenre(genreId);
    });
  }
  
getMoviesByGenre(genre: string): Observable<{ results: MovieModel[] }> {
  return this.http.get<{ results: MovieModel[] }>(
    `${environment.tmdbBaseUrl}/3/discover/movie`,
    {
      headers: {
        Authorization: `Bearer ${tmdbApiReadAccessKey}`,
      },
      params: {
        with_genres: genre
      }
    }
  );
}

```

</details>





