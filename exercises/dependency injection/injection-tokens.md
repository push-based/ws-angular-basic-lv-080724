# Exercise: Dependency Injection - InjectionTokens

In this exercise you will learn a new building block of angulars DI system: `InjectionToken`.

You will introduce a configuration token for the available categories in the movies application
so that `AppShellComponent` & `isCategoryGuard` have a source of data to rely on.

The goal is to have token that defines all available categories in the form of the following
interface:

```ts
// src/app/shared/model/movie-category.model.ts

export interface TMDBCategory {
  id: string;
  label: string;
}
```

## 1. Create TMDB_CATEGORIES Token

Create a new file `src/app/movie/tmdb-categories.ts`.

From there, export a const `TMDB_CATEGORIES` which should be a new `InjectionToken<TMDBCategory>()`. As a first
argument, the `InjectionToken` constructor wants to have a description, give whatever
description you like.

<details>
  <summary>export TMDB_CATEGORIES token</summary>

```ts
// src/app/movie/tmdb-categories.ts

import { InjectionToken } from '@angular/core';

import { TMBDCategory } from '../shared/model/movie-category.model';

export const TMDB_CATEGORIES = new InjectionToken<TMDBCategory[]>('tmdb-categories');

```

</details>

Great, let's provide some data for our new token!

## 2. Provide `TMDB_CATEOGIRES`

Now we need to tell the angular framework about our new token and provide into the DI Hierarchy. We also want to
couple data the token so that it provides the following items:

```ts
[
  {
    id: 'popular',
    label: 'Popular',
  },
  {
    id: 'top_rated',
    label: 'Top Rated',
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
  },
]
```

You have three options to choose from, choose the one you like most:

### 2.1 Option: providedIn: 'root' & `useFactory`

Configure the InjectionToken to be `providedIn: 'root'`. Also give it a `useFactory` function
that returns the static array of items mentioned above.

<details>
  <summary>providedIn: root & useFactory</summary>

```ts

export const TMDB_CATEGORIES = new InjectionToken<TMBDCategory[]>(
  'tmdb-categories',
  {
    providedIn: 'root',
    useFactory: () => ([/* ... data */])
  }
);

```

</details>

### 2.2 Option: manually provide in app.config.ts

Go to `app.config.ts` and add a new provider to the `providers` array, which uses `useValue` to
define the data.

```ts
// app.config.ts

{
  provide: TMDB_CATEGORIES,
  useValue: [/* ... data */]
}
```

### 2.3 Option: create a provider function 👑👑👑👑

This is probably the most clean solution: a custom `providerFunction`. This is how most
tokens should get provided.

Create and export a new `provideTMDBCategories` function inside of `tmdb-categories.ts`. It should return a
static provider that `provide: TMDB_CATEGORIES` with `useValue: [/* data */]`.

<details>
  <summary>provideTMDBCategories</summary>

```ts

export const provideTMDBCategories = () => [
  {
    provide: TMDB_CATEGORIES,
    useValue: /* data ... */
  },
];

```

</details>

Now use your providerFunction in the `app.config.ts`.


Well done! Your first InjectionToken is ready to be used.

## 3. Use `TMDB_CATEGORIES`

Let's go ahead and make use of the new token. We want to use that data in
* `isCategoryGuard` 
* `AppShellComponent` -> iterate over data in template

### 3.1 Improve `isCategoryGuard`

Go to `src/app/is-category.guard.ts`. Instead of iterating over the static array of values, `inject` the 
`TMDB_CATEGORIES` array and use it as a source.

<details>
  <summary>TMDB_CATEGORIES</summary>

```ts
import { inject } from '@angular/core';
import { TMDB_CATEGORIES } from './movie/tmdb-categories';

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  const availableCategories = inject(TMDB_CATEGORIES);
  return availableCategories.map(category => category.id).includes(segments[1].path);
};

```

</details>

Well done! Make sure to test out if the guard is still working or not!

### 3.2 Simplify AppShellComponent 

Go to `src/app/app-shell/app-shell.component.ts` and create field `categories = inject(TMDB_CATEGORIES)`.

Now open the `app-shell.component.html` and use this data in the template to iterate over instead of duplicating the navigation links.

```html
@for (category of categories; track category.id) {
  <!--
    <a [routerLink]="">
      ...
    </a>
  -->
}
```

<details>
  <summary>iterate over categories</summary>

```html

@for (category of categories; track category.id) {
  <a
    [routerLinkActive]="'active'"
    [routerLink]="['/list', category.id]"
    class="navigation--link">
    <div class="navigation--menu-item">
      <fast-svg class="navigation--menu-item-icon" [name]="category.id" />
      {{ category.label }}
    </div>
  </a>
}

```

</details>

Great job, you have successfully implemented, provided and injected an InjectionToken and made
your application more configurable.

Please test out if everything works as expected of course.


## 4. BONUS: baseUrl as a token

TBD!

> [!NOTE]
> This is a BONUS exercise, you don't have to complete it.
