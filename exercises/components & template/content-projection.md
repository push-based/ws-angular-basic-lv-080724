# Exercise: Content Projection

In this exercise you'll learn about a technique that allows you to build highly customizable
and dynamic components: `ContentProjection`.

## 1. Single-Slot: Custom heading for movie-list

First, lets introduce a content slot to define a custom headline for the `MovieListComponent`. We are using it 
to display 4 different lists. We might want to set a custom header that also always
follows the same rules. 

This makes it dynamic & at the same time enforces consistent styling.

### 1.1 Add the content outlet <ng-content />

Open the `MovieListComponent` and insert a `div.movie-list-title` containing an `<ng-content />` directive.

Insert the snippet directly at the top of the template.

<details>
  <summary>add content outlet</summary>

```html
<!-- movie-list.component.ts -->

<div class="movie-list-title">
  <ng-content />
</div>

<!-- @if (empty) block after -->
```

</details>

Well done, you can already start inserting content into it.

### 1.2 Project content

Let's use our new content outlet. Go to `MoviePageComponent` and put any content you like as
content for the `movie-list`.

You probably need to stop using the self-enclosing tag `<movie-list />` in order to put content into it.

<details>
  <summary>Project content</summary>

```html

<div>
  <h1>Movies</h1>
  <h2>Category</h2>
</div>

```

</details>

Nice job! Open up the movie-list page in your browser and see the result in action :)

## 2. Restricted Slot: Access contentChild

We have two problems now:

1. Devs can put any content into the movie-list, without restrictions.
2. movie-list is always occupying space for the title, regardless if one is defined or not

Let's hit two birds with one stone and fix both issues ;).

### 2.1 create a restricted outlet 

The first thing we want to do is to enforce a certain element style that can get used as a movie-list headline.
Please set the `select` input of the `ng-content` directive to `.movie-list-header`.

<details>
  <summary>MovieList restricted outlet</summary>

```html
<!-- movie-list.component.ts -->
<div class="movie-list-title">
  <ng-content select=".movie-list-header" />
</div>

```

</details>

`<ng-content select=".movie-list-header" />`

TBD!

### 2.2 Access content child & compute existence

TBD!

## 3 Dynamic content header contents

Of course we don't want to stick with static content here. Let's put the right title for the right page.
We want to derive the information from the params, as the params decide on what page we are landing.

### 3.1 routeParams signal

For convenience, I suggest you create a `routeParams = signal<Params>({})` signal. You can import `Params` from `@angular/router`.
We are going to use this signal as a source to `compute` our headline.
Fill the signal with the params from the `route.params.subscribe` block.

<details>
  <summary>routeParams signal</summary>

```ts
// movie-list-page.component.ts

routeParams = signal<Params>({});

constructor() {
  this.route.params.subscribe(params => {
    this.routeParams.set(params);
    /* api fetches ... */
  });
}

```

</details>

### 3.2 compute header

For the category we can use the label, we have defined via the `TMDB_CATEGORIES` injection token earlier.

#### 3.2.0 inject TMDB_CATEGORIES

Please `availableCategories = inject(TMDB_CATEGORIES)` into the `MovieListPageComponent` before continuing.

<details>
  <summary>inject TMDB_CATEGORIES</summary>

```ts
// movie-list-page.component.ts
import { TMDB_CATEGORIES } from '../tmdb-categories';

availableCategories = inject(TMDB_CATEGORIES);

```

</details>

#### 3.2.1 compute header

Now create a `header = computed<{heading: string; subheading: string }>()` which should return an object that
defines a `heading` & `subheading`.

We have three paths to consider:

**Category (`params.category`)**

```ts
{
  heading: this.availableCategories.find(category => category.id === params.category).label,
  subheading: 'Category'
}
```


**Genre (`params.genreId`)**

```ts
{
  heading: 'Genre',
  subheading: '' // we don't have information for this
}
```

**Search (`params.query`)**

```ts
{
  heading: 'Search',
  subheading: params.query
}
```

<details>
  <summary>Dynamic computed header</summary>

```ts

header = computed(() => {
  const params = this.routeParams();
  if (params.query) {
    return {
      heading: 'Search',
      subheading: params.query,
    };
  } else if (params.categoryId) {
    return {
      heading: this.availableCategories.find(
        category => category.id === params.categoryId
      ).label,
      subheading: 'Category',
    };
  }
  return {
    heading: 'Genre',
    subheading: '',
  };
});

```

</details>

Well done, now let's use it in the template

#### 3.2.2 set header

The final step that's left is to bind the dynamic header to the template.
