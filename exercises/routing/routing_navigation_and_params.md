# Exercise: Router Params and navigation

Now that we have our basic router configuration in place, it's time to enable our users
to navigate around our app by interacting with the UI.

The goal of this exercise is to enable users navigate between the three main categories
of our movies app:
* `/popular`
* `/top_rated`
* `/upcoming`


## Setup router params

As a first step, we should make sure our router is able to handle parametrized routes in order to switch
between categories.

Re-configure the `list/popular` route in `AppRoutingModule` to take a `category` parameter instead of simply
pointing to `popular`.

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

## Enable user navigation in the sidebar

After the `RoutingModule` is configured perfectly fine, it's time to enable user based navigation.
For this we need to touch the `AppShellComponent` the first time, as it controls the
contents of the sidebar.

Since the categories are static, we don't need to use `*ngFor` here!

Your task is to implement three `a.navigation--link` which should navigate the user to the following routes:

* `list/popular`
* `list/top_rated`
* `list/upcoming`

Add the links below the section header `Discover` in the `nav.navigation` inside the `app-shell.component.html`.

Use the following template as contents for each of the links:

<details>
  <summary>Navigation Link Template</summary>

```html
<a
  class="navigation--link">
  <div class="navigation--menu-item">
    <svg-icon class="navigation--menu-item-icon" name="popular"></svg-icon>
    Popular
  </div>
</a>
```

</details>

In order to enable the navigation, use the `routerLink` directive. The input should be an `array` where the 
first element is the route (`list`) and the second the category (e.g. `popular`).
In order to have visual feedback for the active route, configure the `routerLinkActive` input to `active`.
This will add the `active` class for the active nav item.

<details>
    <summary>Add RouterLinkDirective</summary>

Insert the missing pieces for upcoming and top_rated in your own!

```html

<h3 class="navigation--headline">Discover</h3>
<a
    class="navigation--link"
    [routerLink]="['???', '???']"
    routerLinkActive="active"
  >
    <div class="navigation--menu-item">
      <svg-icon class="navigation--menu-item-icon" name="popular"></svg-icon>
      Popular
    </div>
</a>

<!-- insert the missing categories top_rated and upcoming -->

```

</details>

Serve the application and see if you can navigate by using the newly added navigation links in the sidebar.

## React to RouterParams

We can now handle multiple routes and enabled our users to change the route with UI interaction. What's left is
to properly react to the router params and display the right movies based on the given category.

For this we will have to adjust the code of the `MovieListPageComponent`.
Please inject the `ActivatedRoute` into the constructor of the `MovieListPageComponent`.

In order to read the params from the active route, `subscribe` to the `params` Observable exposed by `ActivatedRoute`.

Use `params.category` in order to dynamically generate a url to fetch the movies (`/3/movie/${params.category}`).

<details>
    <summary>show solution</summary>

```ts
// movie-list-page.component.ts
import { ActivatedRoute } from '@angular/router';

this.activatedRoute.params.subscribe((params) => {
    
    this.movies$ = this.httpClient.get<{ results: MovieModel[] }>(
        `${environment.tmdbBaseUrl}/3/movie/${params.category}`,
        {
            headers: {
                Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
            },
        }
    );
    
});

```

</details>

Congratulations! Now serve the application and navigate between the three categories. You should now see a different set of 
movies based on the url.
