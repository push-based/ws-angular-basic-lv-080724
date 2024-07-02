# Exercise: Control Flow - @if

In this exercise you'll learn how introduce control flow to your templates. Angular has a powerful built-in control flow
syntax that allows you to easily implement e.g. conditional state in your templates.

## 1. Create an isFavorite toggle

The first thing we need is a toggle in our component. For this, introduce a new `isFavorite: boolean` property in the `AppComponent`
and toggle (`this.isFavorite = !this.isFavorite`) inside the `toggleFavorite` method.

<details>
  <summary>Create isFavorite toggle</summary>

```ts
// src/app/app.component.ts

/* component decorator */
export class AppComponent {

  /* code before */
  
  isFavorite = false;

  toggleFavorite(movie) {
    this.isFavorite = !this.isFavorite;
    console.log('toggled', movie, this.isFavorite);
  }
}

```

</details>


Great! You can already check out if your code works by pressing the `.favorite-indicator` button and checking out the console if the 
toggled value actually changes.

## 2. Use @if to display text

Now it's time to tell a difference in the UI if your movie was favoured or not. 
To do that, we want to display the text `I like it` whenever `isFavorite` is true.

Let's use an `@if (isFavorite)` condition in the template for this scenario.


<details>
  <summary>use @if to show text</summary>

```html
<!-- app.component.ts -->

<button class="favorite-indicator" (click)="toggleFavorite(movie)">
  @if (isFavorite) {
    I like it
  }
</button>

```

</details>

## 3. Use @else to display different contents

Only showing text in one state can look weird in the UI. Let's fix that by also displaying a label whenever
`isFavorite` is not true.

Let's display `Like me` whenever `isFavorite` is not true.

Use an `@else` branch to display `Like me` instead of `I like it`.

<details>
  <summary>Show other text with @else</summary>

```html
<!-- app.component.ts -->

<button class="favorite-indicator" (click)="toggleFavorite(movie)">
  @if (isFavorite) {
    I like it
  } @else {
    Like me
  }
</button>

```

</details>

Great job! Check out the application if you now can see the @else branch being displayed properly.

## 4. Use [class] binding to set a `is-favorite` class

Our final polishing for the favorite toggle will be setting the `is-favorite` class on it whenever
`isFavorite` is true.

We'll again use an attribute binding for this. In this case a special one, the `[class]` binding. It let's you
bind boolean values to class names in order to toggle them.

Bind `isFavorite` to the `[class.is-favorite]` attribute of the `favorite-indicator` button.

<details>
  <summary>Set .is-favorite class on favorite indicator</summary>

```html
<!-- app.component.ts -->

<button
  class="favorite-indicator"
  [class.is-favorite]="isFavorite"
  (click)="toggleFavorite(movie)">
    @if (isFavorite) {
      I like it
    } @else {
      Like me
    }
</button>

```

</details>

Well done, open your browser and see the final result. The favorite-indicator button now should have a changing text
as well as a different visual appearance depending on its state.
