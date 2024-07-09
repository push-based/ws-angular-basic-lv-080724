# Exercise: Router Params and navigation

Now that we have our basic router configuration in place, it's time to enable our users
to navigate around our app by interacting with the UI.

The goal of this exercise is to enable users navigate between the three main categories
of our movies app:
* `/popular`
* `/top_rated`
* `/upcoming`

## 1. Setup router params

As a first step, we should make sure our router is able to handle parametrized routes in order to switch
between categories.

Re-configure the `list/popular` route in `app.routes.ts` to take a `category` parameter instead of simply
pointing to `popular`.

`path: list/:category`

<details>
    <summary>Parameterize the list route config</summary>

```ts
// app-routing.module.ts
{
    path: 'list/:category',
    component: MovieListPageComponent
}
```

</details>

## 2. Enable user navigation in the sidebar

After the `Routes` are configured perfectly fine, it's time to enable user based navigation.
For this we need to touch the `AppShellComponent` the first time, as it controls the
contents of the sidebar.

Since the categories are static, we don't need to iterate here!

Your task is to implement three `a.navigation--link` which should navigate the user to the following routes:

* `list/popular`
* `list/top_rated`
* `list/upcoming`

Add the links below the section header `Discover` in the `nav.navigation` inside the `src/app/app-shell/app-shell.component.html`.

You will find a comment that says: `<!-- Insert popular, top_rated & upcoming links here -->`.

Use the following template as contents for each of the links:

```html
<a
  class="navigation--link">
  <div class="navigation--menu-item">
    <fast-svg class="navigation--menu-item-icon" name="popular" />
    Popular
  </div>
</a>
```

In order to make them point to the correct route, we again use the `RouterLink` directive. This time we have to pass
an array of arguments: `[routerLink]="['/list', 'popular']"`.

`/list` is the first part of the path and `popular` is the argument for the `category` we have defined before in the
router configuration.

Of course, you want to replace `popular` with `top_rated` & `upcoming` respectively. For the icon name, the category 
argument and for the displayed label.

<details>
  <summary>Navigation Links</summary>

Please implement the missing pieces (top_rated & upcoming links) on your own!

```html
<!-- src/app/app-shell/app-shell.component.html -->
<!-- other content -->
<nav class="navigation">
  
  <h3 class="navigation--headline">Discover</h3>

  <a
    [routerLink]="['/list', 'popular']"
    class="navigation--link">
    <div class="navigation--menu-item">
      <fast-svg class="navigation--menu-item-icon" name="popular" />
      Popular
    </div>
  </a>
  
  <!-- other links here please -->
  
</nav>

<!-- other content -->

```

</details>

Serve the application and see if you can navigate by using the newly added navigation links in the sidebar.
The navigation itself should work fine, but you won't see any visual change happening - of course.

Let's make that happen!

## 3. React to RouterParams

We can now handle multiple routes and enabled our users to change the route with UI interaction. What's left is
to properly react to the router params and display the right movies based on the given category.

For this we will have to adjust the code of the `MovieListPageComponent` and leverage the `ActivatedRoute`.

1. `inject` the `ActivatedRoute` into the `MovieListPageComponent`.

2. read the params from the active route, `subscribe` to the `params` Observable exposed by `ActivatedRoute`.

3. Use `params.category` and pass it to the `movieService.getMovies()` call

4. Make sure to do `movies.set([])` whenever the params change -> otherwise we screw up the loading indicator 

```ts
private route = inject(ActivatedRoute);

// in constructor
this.route.params.subscribe((params) => {
  // re-set data: movies.set([])
  // movieservice.subscribe
    // signal set
})
```

<details>
    <summary>Use ActivatedRoute to read route params</summary>

```ts
// movie-list-page.component.ts

import { ActivatedRoute } from '@angular/router';

private route = inject(ActivatedRoute);

constructor() {
  this.route.params.subscribe(params => {
    this.movies.set([]); // empty the data before fetching new values
    this.movieService.getMovies(params.category).subscribe(data => {
      this.movies.set(data.results);
    });
  });
}

```

</details>

Congratulations! Now serve the application and navigate between the three categories. You should now see a different set of 
movies based on the url.

## 4. Visual feedback on links

In order to have visual feedback for the active route, use the `RouterLinkActive` directive. For that, apply
`[routerLinkActive]="active"` on the existing a tags with `[routerLink]`.

This will add the `active` class for the active nav item.

Remember, this is an additional `Directive`, so we have to add it to the list of imports in `app-shell.component.ts`.

<details>
    <summary>Add RouterLinkDirective</summary>

```html

<h3 class="navigation--headline">Discover</h3>
<a
    class="navigation--link"
    [routerLink]="['/list', 'popular']"
    routerLinkActive="active"
  >
    <div class="navigation--menu-item">
      <fast-svg class="navigation--menu-item-icon" name="popular"/>
      Popular
    </div>
</a>

<!-- insert the missing categories top_rated and upcoming -->

```

Don't forget the import if not autocompleted:

```ts
// src/app/app-shell.component.ts

/*...*/
import { RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-shell',
  /*...*/
  imports: [
    /*...*/
    RouterLinkActive,
  ],
})
export class AppShellComponent {
  sideDrawerOpen = false;
}

```

</details>

Well done, please navigate around and check if you now see an active state visible on the link you have
selected.

## Full Solution


<details>
  <summary>AppShellComponent Class</summary>

```ts

import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    SideDrawerComponent,
    FastSvgComponent,
    HamburgerButtonComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppShellComponent {
  sideDrawerOpen = false;
}

```

</details>

<details>
  <summary>AppShellComponent Template</summary>

```html

<ui-side-drawer
  [opened]="sideDrawerOpen"
  (openedChange)="sideDrawerOpen = $event">
  <a class="navigation-header" href="/">
    <picture srcset="/assets/images/logo.svg" media="(min-width: 80em)">
      <img
        class="logo-img"
        src="/assets/images/logo.svg"
        title="HubMovies"
        alt="HubMovies"
        width="150"
        height="150" />
    </picture>
  </a>
  <nav class="navigation">
    <h3 class="navigation--headline">Discover</h3>

    <!-- Insert popular, top_rated & upcoming links here -->

    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'popular']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="popular" />
        Popular
      </div>
    </a>
    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'top_rated']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="top_rated" />
        Top Rated
      </div>
    </a>
    <a
      [routerLinkActive]="'active'"
      [routerLink]="['/list', 'upcoming']"
      class="navigation--link">
      <div class="navigation--menu-item">
        <fast-svg class="navigation--menu-item-icon" name="upcoming" />
        Upcoming
      </div>
    </a>

    <h3 class="navigation--headline">Genres</h3>

    <!-- Insert Genre links here -->

  </nav>
  <div class="menu-footer">
    <a
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noreferrer noopener">
      <picture class="tmdb-mark">
        <source
          srcset="/assets/images/tmdbgreen.svg"
          media="(prefers-color-scheme: dark)" />
        <source
          srcset="/assets/images/tmdb.svg"
          media="(prefers-color-scheme: light)" />
        <img width="300" height="118" alt="The Movie Database" src="" />
      </picture>
    </a>
  </div>
</ui-side-drawer>
<div class="content-wrapper">
  <div class="ui-toolbar">
    <ui-hamburger-button
      data-uf="menu-btn"
      class="ui-toolbar--action"
      (click)="sideDrawerOpen = !sideDrawerOpen">
    </ui-hamburger-button>
    <div class="ui-toolbar--widget-container">
      <ui-search-bar />
      <ui-dark-mode-toggle />
      <fast-svg name="account" size="35" />
    </div>
  </div>
  <div class="content">
    <ng-content></ng-content>
  </div>
</div>


```

</details>

<details>
  <summary>MovieListPageComponent</summary>

```ts

import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MovieModel, TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'movie-list-page',
  standalone: true,
  imports: [MovieListComponent],
  template: `
    <div class="favorite-widget">
      @for (fav of favoriteMovies(); track fav; let last = $last) {
        <span>{{ fav.title }}</span>
        @if (!last) {
          <span>•</span>
        }
      }
    </div>
    @if (loading()) {
      <div class="loader"></div>
    } @else {
      <movie-list
        [movies]="movies()"
        [favoriteMovieIds]="favoriteMovieIds()"
        (toggleFavorite)="toggleFavorite($event)" />
    }
  `,
  styles: ``,
})
export class MovieListPageComponent {
  movies = signal<TMDBMovieModel[]>([]);

  loading = computed(() => this.movies().length === 0);

  favoriteMovieIds = signal(new Set<string>(), {
    equal: () => false,
  });

  favoriteMovies = computed(() =>
    this.movies().filter(movie => this.favoriteMovieIds().has(movie.id))
  );

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe(params => {
      this.movies.set([]);
      this.movieService.getMovies(params.category).subscribe(data => {
        this.movies.set(data.results);
      });
    });
  }

  toggleFavorite(movie: MovieModel) {
    this.favoriteMovieIds.update(favoriteMovieIds => {
      if (favoriteMovieIds.has(movie.id)) {
        favoriteMovieIds.delete(movie.id);
      } else {
        favoriteMovieIds.add(movie.id);
      }
      return favoriteMovieIds;
    });
  }
}


```

</details>

<details>
  <summary>app-routes.ts</summary>

```ts

import { Routes } from '@angular/router';

import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/:category',
    component: MovieListPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
];



```

</details>
