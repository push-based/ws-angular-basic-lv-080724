# Exercise: Attribute Directives

In this exercise we want to build our first `Attribute Directive`.

# Advanced way

implement the attribute directive `TiltDirective` (in src/app/shared/). The directive should `rotate` its host element (hint: `ElementRef`)
when _entering_ it with the mouse and reset the rotation when the mouse _leaves_ the host element.

In addition to a simple rotation, the directive should rotate the element according to the position
the cursor entered the element.
If the cursor enters from **left** => rotate to the **right** and vice versa.

Use `ElementRef#nativeElement#addEventListener` to listen to events and `nativeElement#style#transform` to change
the tilt degree of the dom element.

As a final step, make the tilt degrees configurable with an `input` binding.

<details>
  <summary>Helper for advanced way</summary>

```bash
ng g directive shared/tilt
```

```ts

transform = 'rotate()';

this.elementRef.nativeElement.addEventListener('event', callbackFn);

/**
 *
 * returns 0 if entered from left, 1 if entered from right
 */
determineDirection(pos: number): 0 | 1 {
    const width = this.elementRef.nativeElement.clientWidth;
    const middle = this.elementRef.nativeElement.getBoundingClientRect().left + width / 2;
    return (pos > middle ? 1 : 0);
}

```
</details>

# Step by Step

## 1. implement tilt directive

We are going to implement the attribute directive `TiltDirective` (in src/app/shared/).
The directive should `rotate` its host element (hint: `ElementRef`) when _entering_ it with the mouse 
and reset the rotation when the mouse _leaves_ the host element.

generate the directive in `src/app/shared/tilt.directive.ts`

<details>
  <summary>Generate TiltDirective</summary>


```bash
ng generate directive shared/tilt

OR

ng g d shared/tilt
```

```ts
// src/app/shared/tilt.directive.ts
import { Directive } from '@angular/core';

@Directive({
    selector: '[tilt]',
    standalone: true
})
export class TiltDirective {
    
    constructor() {}
}
```

</details>


Implement the `OnInit` Interface, the `ngOnInit` Lifecycle hook and inject the `ElementRef` in the constructor.

> [!TIP]
> type the `ElementRef` as `ElementRef<HTMLElement>`, you will have an easier life

<details>
    <summary>Inject ElementRef and implement OnInit</summary>

```ts
// src/app/shared/tilt.directive.ts

import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[tilt]',
    standalone: true
})
export class TiltDirective implements OnInit {
    
    constructor(private element: ElementRef<HTMLElement>) {}
    
    ngOnInit() {}
    
}
```

</details>

Setup the eventListeners for `mouseleave` and `mouseenter` in `ngOnInit`.

<details>
  <summary>EventListener Setup</summary>


```ts
// src/app/shared/tilt.directive.ts

ngOnInit() {
  this.element.nativeElement.addEventListener('mouseleave', () => {
    // we want to reset the styles here
  });
  
  this.element.nativeElement.addEventListener('mouseenter', (event) => {
    // we want to set the styles here
  });
}

```
</details>


As for the callbacks, we want to set the `nativeElement.style.transform` value to either `rotate(0deg)` on reset
or `rotate(10deg)` on mouse enter.

<details>
  <summary>EventListener callbacks</summary>

```ts
// src/app/shared/tilt.directive.ts

ngOnInit() {
  this.element.nativeElement.addEventListener('mouseleave', () => {
    this.element.nativeElement.style.transform = 'rotate(0deg)';
  });

  this.element.nativeElement.addEventListener('mouseenter', () => {
    this.element.nativeElement.style.transform = 'rotate(5deg)';
  });
}
```

</details>

## 2. use directive to adjust behavior of movie-card

apply the `tilt` directive to the `movie-card.component.ts` template.

It should be applied to the `div.movie-card`.

<details>
  <summary>Use the TiltDirective in MovieCardComponent</summary>

```html
<!--movie-card.component.ts-->

<div class="movie-card" tilt>
    <!--  content-->
</div>
```

If not autocompleted, don't forget to add the `TiltDirective` to the `MovieCardComponent`s `import` array.

```ts
// movie-card.component.ts

import { TiltDirective } from '../../shared/tilt.directive';

@Component({
  /**/,
  imports: [/*...*/, TiltDirective]
})
export class MovieCardComponent {}

```

</details>

serve the application and see if the tilt directive is applied and does what it should

```bash
ng serve
```

## 3. implement the funk :-D

now we want to add a more complex animation and tilt the movie-card according to the mouseposition on enter.

Create a method `determineDirection(pos: number): 0 | 1` in the `TiltDirective` class, which returns `0` in case
the mouse entered from the left side and `1` if it entered from the right side.

Use this method in the `mouseenter` callback in order to determine if we should tilt `-15` or `15` degrees.

<details>
  <summary>determineDirection</summary>

```ts
// tilt.directive.ts

ngOnInit() {
  this.element.nativeElement.addEventListener('mouseleave', () => {
    this.element.nativeElement.style.transform = 'rotate(0deg)';
  });

  this.element.nativeElement.addEventListener('mouseenter', event => {
    const pos = this.determineDirection(event.pageX);
    this.element.nativeElement.style.transform = `rotate(${pos === 0 ? '5deg' : '-5deg'})`;
  });
}

/**
 *
 * returns 0 if entered from left, 1 if entered from right
 */
determineDirection(pos: number): 0 | 1 {
  const width = this.element.nativeElement.clientWidth;
  const middle =
    this.element.nativeElement.getBoundingClientRect().left + width / 2;
  return pos > middle ? 1 : 0;
}
```

</details>

Very nice job! Take a look at the outcome. The behavior should be as described.

## 4. make tilt degrees configurable

We can also make the tilt degrees configurable by using an `input` binding in the `TiltDirective`.

<details>
  <summary>configurable tilt degree</summary>

```ts
// src/app/shared/tilt.directive.ts

tiltDegree = input(5);

```

</details>

use the input value in the `mouseenter` callback.

<details>
  <summary>use the tiltDegree value</summary>


```ts
// tilt.directive.ts

ngOnInit() {
  this.element.nativeElement.addEventListener('mouseleave', () => {
    this.element.nativeElement.style.transform = 'rotate(0deg)';
  });

  this.element.nativeElement.addEventListener('mouseenter', event => {
    const pos = this.determineDirection(event.pageX);
    this.element.nativeElement.style.transform = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `-${this.tiltDegree()}deg`})`;
  });
}

```

</details>

## 4. Configure the degree in MovieCard

configure different `tilt` values in `movie-card`:

`([tiltDegree]="value")`

<details>
  <summary>configure tilt values</summary>

```html
<!--movie-card.component.ts-->
<div class="movie-card" tilt [tiltDegree]="360">
    <!--  content-->
</div>

```

</details>

Great job! Serve the application and test your result with different inputs. 
For sure test out `360` and other values, have fun ;)

```bash
ng serve
```

## Full Solution

<details>
  <summary>TiltDirective</summary>

```ts

import { Directive, ElementRef, input, OnInit } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
})
export class TiltDirective implements OnInit {
  tiltDegree = input(5);

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.element.nativeElement.addEventListener('mouseleave', () => {
      this.element.nativeElement.style.transform = 'rotate(0deg)';
    });

    this.element.nativeElement.addEventListener('mouseenter', event => {
      const pos = this.determineDirection(event.pageX);
      this.element.nativeElement.style.transform = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `-${this.tiltDegree()}deg`})`;
    });
  }

  /**
   *
   * returns 0 if entered from left, 1 if entered from right
   */
  determineDirection(pos: number): 0 | 1 {
    const width = this.element.nativeElement.clientWidth;
    const middle =
      this.element.nativeElement.getBoundingClientRect().left + width / 2;
    return pos > middle ? 1 : 0;
  }
}


```

</details>

<details>
  <summary>MovieCardComponent</summary>

```ts
import { Component, input, model } from '@angular/core';

import { MovieModel } from '../../shared/model/movie.model';
import { TiltDirective } from '../../shared/tilt.directive';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [StarRatingComponent, TiltDirective],
  template: `
    <div class="movie-card" tilt [tiltDegree]="360">
      <img
        class="movie-image"
        [alt]="movie().title"
        [src]="'https://image.tmdb.org/t/p/w342' + movie().poster_path" />
      <div class="movie-card-content">
        <div class="movie-card-title">{{ movie().title }}</div>
        <div class="movie-card-rating">
          <ui-star-rating [rating]="movie().vote_average" />
        </div>
      </div>
      <button
        class="favorite-indicator"
        [class.is-favorite]="favorite()"
        (click)="toggle()">
        @if (favorite()) {
          I like it
        } @else {
          Like me
        }
      </button>
    </div>
  `,
  styles: `
    .movie-card {
      transition:
        box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    }

    .movie-card:hover {
      .movie-image {
        transform: scale(1);
      }
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.6);
    }

    .movie-image {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      transform: scale(0.97);
    }

    .movie-card-content {
      text-align: center;
      padding: 1.5rem 3rem;
      font-size: 1.5rem;
    }

    .movie-card-title {
      font-size: 2rem;
    }
  `,
})
export class MovieCardComponent {
  movie = input.required<MovieModel>();
  favorite = model(false);

  toggle() {
    this.favorite.set(!this.favorite());
  }
}

```

</details>
