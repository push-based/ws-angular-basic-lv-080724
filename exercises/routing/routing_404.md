# Exercise: Router 404

In this exercise you are going to deepen your knowledge about angulars router configuration. We are going to introduce
a fallback mechanism that shows a meaningful message to the user in case they entered a non-existing route.

## 0. Be aware of the error

Please try to enter any invalid route into the address-bar of your browser (e.g. `list/populardawdaw`), you will see the application navigates back to the default
route and throw an error in the console.

`Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'list/populardawdaw'`

## 1. Create a NotFoundPageComponent

Let's build a **beautiful** 404 page in case of a user entering an invalid url.

It does not need any typescript logic whatsoever but just should have a template showing the
user that this page is invalid and giving him a link back to a valid site.

<details>
  <summary>Generate NotFoundPageComponent</summary>

```bash
ng g c not-found-page
```

</details>

The template should look like this:

```html
<div class="not-found-container">
  <fast-svg size="350px" name="error"></fast-svg>
  <h1 class="title">Sorry, page not found</h1>
</div>
```

Make sure to import the `FastSvgComponent` from `@push-based/ngx-fast-svg`.

Also add some styles to make it visually more appealing:

```scss
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

<details>
    <summary>NotFoundPageComponent implementation</summary>

```ts
import { Component } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'not-found-page',
  standalone: true,
  imports: [FastSvgComponent],
  template: `
    <div class="not-found-container">
      <fast-svg size="350px" name="error"></fast-svg>
      <h1 class="title">Sorry, page not found</h1>
    </div>
  `,
  styles: `
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
  `,
})
export class NotFoundPageComponent {}

```
</details>


After you've implemented the `NotFoundPageComponent`, the only thing left is to configure it to be shown as
wildcard route.

## 2. Configure the fallback

Let's make sure that the new `NotFoundPageComponent` is shown as wildcard (`**`) route.

For this, adjust the `app.routes.ts`. Add the `NotFoundPageComponent` as component for the path `**`.

> [!WARNING]
> It's very important that the wildcard configuration is the last config in the array.
> Otherwise you'll always end up on the NotFoundPageComponent. 

```ts
{
  path: '**',
  component: NotFoundPageComponent
}
```

<details>
    <summary>Router Configuration</summary>

```ts
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/popular',
    component: MovieListPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

```

</details>


Well done! Serve the application and again try enter an invalid url. The application now should display the 404 page component instead.

## 3. Let the user navigate back

You might have noticed it's a bit cumbersome to always enter a URL in the navigation bar. Especially for users ending up on the 404 page.
Let's introduce a link to the template that navigates users back to the `/list/popular` route.

Angulars router page provides a nice `Directive` for such use cases: `RouterLink`. 

1. Add a `<a class="btn">See popular</a>` to the `not-found-page.component.ts` template.

2. Add the `routerLink="/list/popular"` directive to it.

3. Don't forget to import the `RouterLink` directive to the component.

<details>
  <summary>NotFoundPageComponent with back navigation</summary>

```ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'not-found-page',
  standalone: true,
  imports: [FastSvgComponent, RouterLink],
  template: `
    <div class="not-found-container">
      <fast-svg size="350px" name="error"></fast-svg>
      <h1 class="title">Sorry, page not found</h1>

      <a class="btn" routerLink="/list/popular">See popular</a>
    </div>
  `,
  styles: ``,
})
export class NotFoundPageComponent {}


```

</details>

Great job! Go ahead and try out if the link works!

