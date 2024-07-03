# Exercise: Router Guards

In this exercise you will learn about yet another concept of angulars router: `Guards`.

You will implement a validation for the possible parameters of `:category` for the `list` route.
If the category is something else than `popular | upcoming | top_rated`, the user should see
the `NotFoundPageComponent`.

## 0. Understand the Problem

Try to navigate to `/list/upcoming2` -> an actually invalid route. You'll notice that you end up on
the `MovieListPageComponent`, but no movies are shown. The user of course has no idea that a mistake happened.
Let's build a solution to this issue and enhance the UX of our app.

## 1. Create isCategoryGuard

First, let's use the angular cli to create a new `CanMatchGuard` for us. You could also choose to implement
a `CanActivate` guard.

`ng g guard is-category`

Follow the instructions from the cli and choose `CanMatch` as your interface of choice.

```shell
$ ng g guard is-category

? Which type of guard would you like to create? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◯ CanActivate
 ◯ CanActivateChild
 ◯ CanDeactivate
❯◉ CanMatch

```

You should now get a new file `is-category.guard.ts`.

<details>
  <summary>isCategoryGuard Skeleton</summary>

```ts

import { CanMatchFn } from '@angular/router';

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  return true;
};

```

</details>

## 2. Configure isCategoryGuard

Before we start the implementation, let's already tell the router this guard exists.

Go to the `app.routes.ts` file and a set the `isCategoryGuard` as `canMatch` property
for the `path: 'list/:category` route.

<details>
  <summary>Use isCategoryGuard</summary>

```ts
// src/app/app.routes.ts

import { isCategoryGuard } from './is-category.guard';

/* before */
{
  path: 'list/:category',
  component: MovieListPageComponent,
  canMatch: [isCategoryGuard], // 👈️
},

/* after */

```

</details>

Great, your guard is now active and running. Let's build the internals!

## 3. Implement isCategoryGuard

Now implement the business logic. You should return a boolean value indicating if the current
route includes `'popular', 'top_rated', 'upcoming'`.

Your best bet is to use the `segments: UrlSegment[]` argument. 

### 3.1 Debug the inputs

To better understand what the arguments tell you, print them out to the console.

```ts

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  console.log('category guard', segments);
  return true;
};

```

Now run the application and navigate to `/list/popular` or any other category route.

### 3.2 Build the logic

Let's build the actual logic. The segments will contain two entries for each segment of the url:
`list` & `popular`.

Check the second entry (`segments[1].path`) for its value and compute your result from it.

<details>
  <summary>isCategoryGuard implementation</summary>

```ts

import { CanMatchFn } from '@angular/router';

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  return ['popular', 'top_rated', 'upcoming'].includes(segments[1].path);
};


```

</details>

Great job!! Try your guard by again routing to an invalid route. You should now be faced with the
component we've configured as wildcard: `NotFoundPageComponent` ;).
